import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Database } from "@/integrations/supabase/types";

type FactCheckResult = Database['public']['Tables']['fact_check_records']['Row']['fact_check_result'];

export const FactCheckSection = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FactCheckResult>(null);
  const { toast } = useToast();

  const analyzeContent = async () => {
    if (!content) {
      toast({
        title: "Content Required",
        description: "Please enter some content to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-content', {
        body: { content },
      });

      if (error) throw error;

      setResult(data.analysis);

      // Save to database
      const { error: insertError } = await supabase
        .from('fact_check_records')
        .insert({
          title: title || 'Untitled Check',
          original_content: content,
          fact_check_result: data.analysis,
          verification_status: 'completed'
        });

      if (insertError) throw insertError;

      toast({
        title: "Analysis Complete",
        description: "Content has been analyzed and saved",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="w-full bg-white shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary to-secondary p-6">
        <CardTitle className="text-white text-2xl font-bold">
          Fact-Check Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <Input
            placeholder="Enter title for reference"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
          />
          <Textarea
            placeholder="Paste content to analyze..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[200px]"
          />
          <Button
            onClick={analyzeContent}
            disabled={isAnalyzing}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Content'
            )}
          </Button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 space-y-4"
            >
              <div className="flex items-center gap-2">
                <div className="text-lg font-semibold">Veracity:</div>
                <div className="flex items-center">
                  {result.veracity === 'true' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {result.veracity === 'false' && (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="ml-2">{result.veracity}</span>
                </div>
              </div>
              <div>
                <div className="text-lg font-semibold">Explanation:</div>
                <p className="mt-2 text-gray-700">{result.explanation}</p>
              </div>
              <div>
                <div className="text-lg font-semibold">Sources:</div>
                <ul className="list-disc list-inside mt-2">
                  {result.sources.map((source, index) => (
                    <li key={index} className="text-blue-600 hover:underline">
                      {source}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-lg font-semibold">Confidence:</div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2"
                    style={{ width: `${result.confidence * 100}%` }}
                  />
                </div>
                <div>{Math.round(result.confidence * 100)}%</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};