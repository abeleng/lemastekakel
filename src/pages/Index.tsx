import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChartBar, Globe, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const navigate = useNavigate();

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="container mx-auto px-4 text-center z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
              LeMastekakel
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Combat misinformation in Ethiopia with real-time tracking and analysis
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-md mx-auto"
          >
            <Button 
              onClick={checkSession}
              className="w-full"
            >
              Access Dashboard
            </Button>
          </motion.div>
        </div>
      </motion.section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-gray-50 hover:shadow-md transition-shadow"
              >
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Start Tracking Misinformation Today
          </h2>
          <Button 
            variant="secondary"
            onClick={() => navigate('/login')} 
            className="bg-white text-primary hover:bg-gray-100"
          >
            Get Started
          </Button>
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    icon: <ChartBar className="h-6 w-6" />,
    title: 'Real-time Analytics',
    description: 'Track and analyze misinformation trends as they emerge across various media channels.',
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: 'Geographic Insights',
    description: 'Visualize the spread of misinformation across different regions in Ethiopia.',
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: 'Influencer Tracking',
    description: 'Monitor key influencers and their impact on information spread.',
  },
];

export default Index;