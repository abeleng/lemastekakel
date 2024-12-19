import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { GeographicDistribution } from '@/components/dashboard/GeographicDistribution';
import { InfluencerTable } from '@/components/dashboard/InfluencerTable';
import { MisinformationStats } from '@/components/dashboard/MisinformationStats';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Button 
            variant="outline" 
            onClick={async () => {
              await supabase.auth.signOut();
              navigate('/login');
            }}
          >
            Sign Out
          </Button>
        </header>

        <MisinformationStats />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Misinformation Trends</h2>
            <TrendChart />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Geographic Distribution</h2>
            <GeographicDistribution />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Top Influencers</h2>
          <InfluencerTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;