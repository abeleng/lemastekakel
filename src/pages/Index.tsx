import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleDemoRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle demo request logic here
    console.log('Demo requested for:', email);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
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
            <form onSubmit={handleDemoRequest} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
              <Button type="submit" className="btn-primary w-full">
                Request Demo
              </Button>
            </form>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
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
                className="p-6 rounded-xl bg-gray-50 card-hover"
              >
                <div className="text-accent mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Start Tracking Misinformation Today
          </h2>
          <Button 
            onClick={() => navigate('/login')} 
            className="btn-secondary"
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
    icon: '📊',
    title: 'Real-time Analytics',
    description: 'Track and analyze misinformation trends as they emerge across various media channels.',
  },
  {
    icon: '🎯',
    title: 'Influencer Tracking',
    description: 'Monitor key influencers and their impact on information spread.',
  },
  {
    icon: '🔍',
    title: 'Fact Checking',
    description: 'Access verified data from trusted Ethiopian academic sources.',
  },
];

export default Index;