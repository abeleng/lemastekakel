import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { content } = await req.json()

    // Here we would integrate with external APIs
    // For now, we'll use a simple sentiment analysis
    const words = content.toLowerCase().split(' ')
    const positiveWords = ['good', 'great', 'excellent', 'positive', 'true']
    const negativeWords = ['bad', 'false', 'negative', 'wrong', 'misleading']
    
    let sentiment = 0
    words.forEach(word => {
      if (positiveWords.includes(word)) sentiment += 1
      if (negativeWords.includes(word)) sentiment -= 1
    })

    // Normalize sentiment to be between -1 and 1
    sentiment = sentiment / Math.max(words.length, 1)

    return new Response(
      JSON.stringify({ sentiment }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})