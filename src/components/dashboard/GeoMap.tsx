import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface GeoPoint {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    count: number;
    region: string;
    insights: any;
  };
}

interface GeoData {
  region: string;
  misinformation_count: number;
  ai_insights: any;
}

export const GeoMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [data, setData] = useState<GeoData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchGeoData();
  }, []);

  const fetchGeoData = async () => {
    try {
      const { data, error } = await supabase
        .from('geographic_distribution')
        .select('*');

      if (error) throw error;
      setData(data);
    } catch (error: any) {
      toast({
        title: "Error fetching geographic data",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!mapContainer.current || !data.length) return;

    // Initialize map
    mapboxgl.accessToken = process.env.MAPBOX_PUBLIC_TOKEN || '';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [40, 9], // Center on Ethiopia
      zoom: 5,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add data points when map loads
    map.current.on('load', () => {
      if (!map.current) return;

      const geoJsonData: { type: 'FeatureCollection', features: GeoPoint[] } = {
        type: 'FeatureCollection',
        features: data.map(point => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: getCoordinatesFromRegion(point.region),
          },
          properties: {
            count: point.misinformation_count || 0,
            region: point.region,
            insights: point.ai_insights,
          },
        })),
      };

      // Add a data source
      map.current.addSource('misinformation-points', {
        type: 'geojson',
        data: geoJsonData,
      });

      // Add a layer to visualize the points
      map.current.addLayer({
        id: 'misinformation-heat',
        type: 'heatmap',
        source: 'misinformation-points',
        paint: {
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'count'],
            0, 0,
            100, 1
          ],
          'heatmap-intensity': 1,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0,0,255,0)',
            0.2, 'rgb(0,0,255)',
            0.4, 'rgb(0,255,0)',
            0.6, 'rgb(255,255,0)',
            0.8, 'rgb(255,128,0)',
            1, 'rgb(255,0,0)'
          ],
          'heatmap-radius': 30,
          'heatmap-opacity': 0.8
        }
      });

      // Add popup on click
      map.current.on('click', 'misinformation-heat', (e) => {
        if (!e.features?.[0]) return;
        
        const feature = e.features[0] as GeoPoint;
        const coordinates = feature.geometry.coordinates;
        const properties = feature.properties;
        
        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(`
            <h3 class="font-bold">${properties.region}</h3>
            <p>Misinformation Count: ${properties.count}</p>
            ${properties.insights ? `<p class="text-sm mt-2">${properties.insights.analysis}</p>` : ''}
          `)
          .addTo(map.current!);
      });
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [data]);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Geographic Distribution of Misinformation</h2>
      <div ref={mapContainer} className="h-[600px] w-full rounded-lg overflow-hidden" />
      {data[0]?.ai_insights && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">AI Geographic Insights</h3>
          <p className="text-gray-600">{data[0].ai_insights.analysis}</p>
        </div>
      )}
    </Card>
  );
};

// Helper function to convert region names to coordinates
const getCoordinatesFromRegion = (region: string): [number, number] => {
  // Approximate coordinates for Ethiopian regions
  const coordinates: { [key: string]: [number, number] } = {
    'Addis Ababa': [38.7578, 9.0222],
    'Oromia': [40.0000, 8.0000],
    'Amhara': [38.5000, 11.5000],
    'Tigray': [39.0000, 14.0000],
    'Somali': [44.0000, 7.0000],
    'SNNPR': [37.0000, 6.5000],
    'Afar': [41.0000, 12.0000],
    'Benishangul-Gumuz': [35.0000, 10.0000],
    'Gambela': [34.5000, 8.0000],
    'Harari': [42.1500, 9.3200],
    'Dire Dawa': [41.8600, 9.5900],
  };

  return coordinates[region] || [40, 9]; // Default to center of Ethiopia if region not found
};