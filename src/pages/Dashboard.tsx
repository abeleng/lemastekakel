import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { GeographicDistribution } from '@/components/dashboard/GeographicDistribution';
import { InfluencerTable } from '@/components/dashboard/InfluencerTable';
import { MisinformationStats } from '@/components/dashboard/MisinformationStats';
import { useToast } from '@/components/ui/use-toast';
import { ChartBar, MapPin, User, TrendingUp, Globe } from 'lucide-react';

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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">LeMastekakel Dashboard</h1>
            <p className="text-gray-600">Monitor and analyze misinformation in real-time</p>
          </div>
          <Button 
            variant="outline" 
            onClick={async () => {
              await supabase.auth.signOut();
              navigate('/login');
              toast({
                title: "Signed out successfully",
                description: "You have been logged out of your account.",
              });
            }}
          >
            Sign Out
          </Button>
        </header>

        <MisinformationStats />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Misinformation Trends</h2>
            </div>
            <TrendChart />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Geographic Distribution</h2>
            </div>
            <GeographicDistribution />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Top Influencers</h2>
          </div>
          <InfluencerTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;