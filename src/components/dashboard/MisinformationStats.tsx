import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/components/ui/use-toast';

export const MisinformationStats = () => {
  const [stats, setStats] = useState({
    totalFlagged: 0,
    activeInfluencers: 0,
    avgEngagement: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      // Get total flagged content
      const { count: flaggedCount, error: flaggedError } = await supabase
        .from('misinformation_logs')
        .select('*', { count: 'exact' });

      // Get active influencers count
      const { count: influencersCount, error: influencersError } = await supabase
        .from('influencers')
        .select('*', { count: 'exact' });

      // Get average engagement rate
      const { data: engagementData, error: engagementError } = await supabase
        .from('influencers')
        .select('engagement_rate');

      if (flaggedError || influencersError || engagementError) {
        toast({
          title: "Error fetching statistics",
          description: "Could not load some statistics",
          variant: "destructive",
        });
        return;
      }

      const avgEngagement = engagementData?.reduce((acc, curr) => acc + (curr.engagement_rate || 0), 0) / 
        (engagementData?.length || 1);

      setStats({
        totalFlagged: flaggedCount || 0,
        activeInfluencers: influencersCount || 0,
        avgEngagement: avgEngagement || 0,
      });
    };

    fetchStats();

    // Set up real-time subscriptions for all relevant tables
    const channels = [
      supabase.channel('stats-misinformation-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'misinformation_logs' }, () => fetchStats()),
      supabase.channel('stats-influencers-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'influencers' }, () => fetchStats()),
    ];

    channels.forEach(channel => channel.subscribe());

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [toast]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Flagged Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalFlagged}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Influencers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeInfluencers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Engagement Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgEngagement.toFixed(2)}%</div>
        </CardContent>
      </Card>
    </div>
  );
};