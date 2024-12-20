import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content } = await req.json();

    if (!content) {
      throw new Error('Content is required');
    }

    if (!geminiApiKey) {
      throw new Error('Gemini API key is not configured');
    }

    console.log('Analyzing content:', content);

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Analyze this content and provide a detailed fact-check report. The content is related to potential misinformation in Ethiopia. Please structure your response in JSON format with the following fields:
    {
      "veracity": "true/false/partially true",
      "explanation": "detailed explanation",
      "sources": ["list of relevant sources"],
      "confidence": 0-1
    }
    
    Content to analyze: ${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Gemini Response:', text);

    // Parse the response text as JSON
    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      analysis = {
        veracity: "unknown",
        explanation: text,
        sources: [],
        confidence: 0.5
      };
    }

    const finalResponse = {
      analysis,
      timestamp: new Date().toISOString(),
      model: 'gemini-pro'
    };

    return new Response(JSON.stringify(finalResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-content function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});