import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '@/components/ui/use-toast';

export const TrendChart = () => {
  const [data, setData] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTrends = async () => {
      const { data, error } = await supabase
        .from('misinformation_trends')
        .select('*')
        .order('time_period', { ascending: true });

      if (error) {
        toast({
          title: "Error fetching trends",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setData(data);
    };

    fetchTrends();

    // Set up real-time subscription
    const channel = supabase
      .channel('trends-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'misinformation_trends' },
        (payload) => {
          fetchTrends();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return (
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
  );
};