import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useToast } from '@/components/ui/use-toast';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const GeographicDistribution = () => {
  const [data, setData] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDistribution = async () => {
      const { data, error } = await supabase
        .from('geographic_distribution')
        .select('*')
        .order('misinformation_count', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching distribution",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setData(data);
    };

    fetchDistribution();

    const channel = supabase
      .channel('distribution-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'geographic_distribution' },
        (payload) => {
          fetchDistribution();
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
        <PieChart>
          <Pie
            data={data}
            dataKey="misinformation_count"
            nameKey="region"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};