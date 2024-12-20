import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content } = await req.json();

    // Basic sentiment analysis (this would be replaced with more sophisticated analysis)
    const words = content.toLowerCase().split(' ');
    const positiveWords = ['good', 'great', 'excellent', 'positive', 'true', 'factual'];
    const negativeWords = ['false', 'fake', 'misleading', 'incorrect', 'wrong', 'untrue'];
    
    let sentiment = 0;
    words.forEach(word => {
      if (positiveWords.includes(word)) sentiment += 1;
      if (negativeWords.includes(word)) sentiment -= 1;
    });

    // Normalize sentiment to be between -1 and 1
    sentiment = sentiment / Math.max(words.length, 1);

    return new Response(
      JSON.stringify({ 
        sentiment,
        analyzed: true,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in analyze-content function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});