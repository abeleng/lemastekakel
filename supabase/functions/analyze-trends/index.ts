import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl!, supabaseKey!);

    // Fetch trends data
    const { data: trends, error: trendsError } = await supabase
      .from('misinformation_trends')
      .select('*')
      .order('time_period', { ascending: true });

    if (trendsError) throw trendsError;

    // Fetch geographic data
    const { data: geoData, error: geoError } = await supabase
      .from('geographic_distribution')
      .select('*');

    if (geoError) throw geoError;

    // Prepare data for Gemini
    const prompt = `Analyze this misinformation trend data from Ethiopia and provide insights:
      Trends: ${JSON.stringify(trends)}
      Geographic Distribution: ${JSON.stringify(geoData)}
      
      Please provide:
      1. Key patterns and correlations
      2. Geographic hotspots
      3. Potential causes
      4. Recommendations
      
      Format the response as JSON with these keys: patterns, hotspots, causes, recommendations`;

    // Call Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': geminiApiKey!,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    const analysisResult = await response.json();
    
    // Extract the analysis text and parse it as JSON
    const analysisText = analysisResult.candidates[0].content.parts[0].text;
    const analysis = JSON.parse(analysisText);

    // Update the database with AI insights
    const { error: updateError } = await supabase
      .from('misinformation_trends')
      .update({ ai_analysis: analysis })
      .eq('id', trends[trends.length - 1].id);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ success: true, analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-trends function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});