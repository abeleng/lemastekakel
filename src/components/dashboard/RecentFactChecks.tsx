import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, Clock } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type FactCheckRecord = Database['public']['Tables']['fact_check_records']['Row'];

export const RecentFactChecks = () => {
  const [checks, setChecks] = useState<FactCheckRecord[]>([]);

  useEffect(() => {
    const fetchChecks = async () => {
      const { data, error } = await supabase
        .from('fact_check_records')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        setChecks(data);
      }
    };

    fetchChecks();

    const channel = supabase
      .channel('fact-checks-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'fact_check_records' },
        () => fetchChecks()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getVeracityIcon = (status) => {
    if (status === 'true') return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (status === 'false') return <AlertTriangle className="h-5 w-5 text-red-500" />;
    return <Clock className="h-5 w-5 text-yellow-500" />;
  };

  return (
    <Card className="w-full bg-white shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-accent to-secondary p-6">
        <CardTitle className="text-white text-2xl font-bold">
          Recent Fact-Checks
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          {checks.map((check, index) => (
            <motion.div
              key={check.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getVeracityIcon(check.fact_check_result?.veracity)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{check.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {check.original_content}
                  </p>
                  {check.fact_check_result && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">
                        {check.fact_check_result.explanation}
                      </p>
                      {check.fact_check_result.sources?.length > 0 && (
                        <div className="mt-2 text-sm text-blue-600">
                          Sources: {check.fact_check_result.sources.join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="mt-2 text-sm text-gray-500">
                    {new Date(check.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};