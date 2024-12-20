import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { GeographicDistribution } from '@/components/dashboard/GeographicDistribution';
import { InfluencerTable } from '@/components/dashboard/InfluencerTable';
import { MisinformationStats } from '@/components/dashboard/MisinformationStats';
import { AcademicSources } from '@/components/dashboard/AcademicSources';
import { useToast } from '@/components/ui/use-toast';
import { ChartBar, MapPin, User, TrendingUp, Globe, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [recentContent, setRecentContent] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      } else {
        setLoading(false);
        fetchRecentContent();
      }
    };
    checkSession();
  }, [navigate]);

  const fetchRecentContent = async () => {
    const { data, error } = await supabase
      .from('misinformation_logs')
      .select('*')
      .order('flagged_at', { ascending: false })
      .limit(5);

    if (error) {
      toast({
        title: "Error fetching content",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setRecentContent(data);
  };

  const analyzeContent = async (content) => {
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-content', {
        body: { content },
      });

      if (error) throw error;

      toast({
        title: "Analysis Complete",
        description: "Content has been analyzed successfully",
      });

      await supabase
        .from('content_analysis')
        .insert([{
          content_id: content.id,
          analysis_type: 'openai',
          result: data.analysis,
          confidence_score: 0.95,
        }]);

    } catch (error) {
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm"
        >
          <div>
            <h1 className="text-3xl font-bold text-primary">LeMastekakel Dashboard</h1>
            <p className="text-gray-600">Real-time misinformation tracking in Ethiopia</p>
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
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MisinformationStats />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Misinformation Trends</h2>
            </div>
            <TrendChart />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Geographic Distribution</h2>
            </div>
            <GeographicDistribution />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Recent Content Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                {recentContent.map((content) => (
                  <motion.div
                    key={content.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-4 p-4 border rounded-lg hover:border-primary transition-colors"
                  >
                    <p className="text-sm text-gray-600 mb-2">
                      {new Date(content.flagged_at).toLocaleDateString()}
                    </p>
                    <p className="mb-2">{content.content}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => analyzeContent(content)}
                      disabled={analyzing}
                    >
                      {analyzing ? 'Analyzing...' : 'Analyze Content'}
                    </Button>
                  </motion.div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Top Influencers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InfluencerTable />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <AcademicSources />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;