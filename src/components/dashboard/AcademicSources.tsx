import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from "@/components/ui/scroll-area";

export const AcademicSources = () => {
  const [sources, setSources] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSources = async () => {
      const { data, error } = await supabase
        .from('academic_sources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching academic sources",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setSources(data);
    };

    fetchSources();

    const channel = supabase
      .channel('academic-sources-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'academic_sources' },
        () => {
          fetchSources();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {sources.map((source: any) => (
            <div key={source.id} className="mb-4 p-4 border rounded">
              <h3 className="font-semibold">{source.title}</h3>
              <p className="text-sm text-gray-600">{source.source}</p>
              <p className="mt-2">{source.content}</p>
              {source.keywords && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {source.keywords.map((keyword: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary text-sm rounded"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};