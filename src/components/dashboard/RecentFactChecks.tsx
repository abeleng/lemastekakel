import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, Clock } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import type { FactCheckResult } from '@/types/fact-check';

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

  const getVeracityIcon = (result: FactCheckResult | null) => {
    if (!result) return <Clock className="h-5 w-5 text-yellow-500" />;
    switch (result.veracity.toLowerCase()) {
      case 'true':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'false':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getVeracityColor = (veracity: string) => {
    switch (veracity.toLowerCase()) {
      case 'true':
        return 'text-green-600';
      case 'false':
        return 'text-red-600';
      case 'partially true':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
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
          {checks.map((check, index) => {
            const result = check.fact_check_result as unknown as FactCheckResult;
            return (
              <motion.div
                key={check.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getVeracityIcon(result)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{check.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {check.original_content}
                    </p>
                    {result && (
                      <div className="space-y-3">
                        <div className={`font-medium ${getVeracityColor(result.veracity)}`}>
                          Verdict: <span className="capitalize">{result.veracity}</span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {result.explanation}
                          </p>
                          {result.sources?.length > 0 && (
                            <div className="mt-2 text-sm">
                              <span className="font-medium">Sources:</span>{' '}
                              <span className="text-blue-600">
                                {result.sources.join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="mt-2 text-sm text-gray-500">
                      {new Date(check.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};