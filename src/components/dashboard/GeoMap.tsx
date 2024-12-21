import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const GeoMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any[]>([]);
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
    if (!containerRef.current || !data.length) return;

    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Add Earth sphere
    const earthGeometry = new THREE.SphereGeometry(5, 32, 32);
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load('/earth-texture.jpg'),
      bumpMap: new THREE.TextureLoader().load('/earth-bump.jpg'),
      bumpScale: 0.05,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Add data points
    data.forEach((point) => {
      const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
      const markerMaterial = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color(`hsl(${(point.misinformation_count / 100) * 360}, 70%, 50%)`),
        emissive: new THREE.Color(`hsl(${(point.misinformation_count / 100) * 360}, 70%, 50%)`),
        emissiveIntensity: 0.5,
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      
      // Position marker based on region (simplified for example)
      const position = getPositionFromRegion(point.region);
      marker.position.set(position.x, position.y, position.z);
      scene.add(marker);
    });

    // Set up camera and controls
    camera.position.z = 15;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      earth.rotation.y += 0.001;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [data]);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Geographic Distribution of Misinformation</h2>
      <div ref={containerRef} className="h-[600px] w-full" />
      {data[0]?.ai_insights && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">AI Geographic Insights</h3>
          <p className="text-gray-600">{data[0].ai_insights.analysis}</p>
        </div>
      )}
    </Card>
  );
};

// Helper function to convert region names to 3D coordinates
const getPositionFromRegion = (region: string) => {
  // This is a simplified example - you would need a proper mapping of Ethiopian regions to coordinates
  const coordinates: { [key: string]: { x: number, y: number, z: number } } = {
    'Addis Ababa': { x: 5, y: 0, z: 0 },
    'Oromia': { x: 4, y: 2, z: 2 },
    'Amhara': { x: 3, y: -2, z: 3 },
    // Add more regions as needed
  };

  return coordinates[region] || { x: 0, y: 0, z: 5 };
};