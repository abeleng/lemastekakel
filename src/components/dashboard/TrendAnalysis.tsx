import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export const TrendAnalysis = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('misinformation_trends')
        .select('*')
        .order('time_period', { ascending: true });

      if (error) throw error;
      setData(data);
    } catch (error: any) {
      toast({
        title: "Error fetching trends",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeWithAI = async () => {
    setAnalyzing(true);
    try {
      const { data: analysis, error } = await supabase.functions.invoke('analyze-trends');
      
      if (error) throw error;
      
      toast({
        title: "Analysis Complete",
        description: "AI insights have been updated",
      });
      
      fetchTrends();
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Misinformation Trends Analysis</h2>
        <Button 
          onClick={analyzeWithAI}
          disabled={analyzing}
          className="flex items-center gap-2"
        >
          {analyzing && <Loader2 className="h-4 w-4 animate-spin" />}
          {analyzing ? 'Analyzing...' : 'Analyze with AI'}
        </Button>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time_period" 
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="frequency" 
              stroke="#8884d8" 
              name="Frequency"
            />
            <Line 
              type="monotone" 
              dataKey="sentiment" 
              stroke="#82ca9d" 
              name="Sentiment"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {data[data.length - 1]?.ai_analysis && (
        <div className="mt-6 space-y-4">
          <h3 className="text-xl font-semibold">AI Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Key Patterns</h4>
              <p className="text-gray-600">{data[data.length - 1].ai_analysis.patterns}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Geographic Hotspots</h4>
              <p className="text-gray-600">{data[data.length - 1].ai_analysis.hotspots}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Potential Causes</h4>
              <p className="text-gray-600">{data[data.length - 1].ai_analysis.causes}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Recommendations</h4>
              <p className="text-gray-600">{data[data.length - 1].ai_analysis.recommendations}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};