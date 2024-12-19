import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from '@/components/ui/use-toast';

export const InfluencerTable = () => {
  const [influencers, setInfluencers] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInfluencers = async () => {
      const { data, error } = await supabase
        .from('influencers')
        .select('*')
        .order('follower_count', { ascending: false })
        .limit(10);

      if (error) {
        toast({
          title: "Error fetching influencers",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setInfluencers(data);
    };

    fetchInfluencers();

    const channel = supabase
      .channel('influencers-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'influencers' },
        (payload) => {
          fetchInfluencers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Platform</TableHead>
          <TableHead>Followers</TableHead>
          <TableHead>Engagement Rate</TableHead>
          <TableHead>Flagged Content</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {influencers.map((influencer) => (
          <TableRow key={influencer.id}>
            <TableCell className="font-medium">{influencer.name}</TableCell>
            <TableCell>{influencer.platform}</TableCell>
            <TableCell>{influencer.follower_count?.toLocaleString()}</TableCell>
            <TableCell>{(influencer.engagement_rate || 0).toFixed(2)}%</TableCell>
            <TableCell>{influencer.flagged_content_count}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};