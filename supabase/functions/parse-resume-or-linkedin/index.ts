// Add this line at the top of your file
// deno-lint-ignore-file no-explicit-any

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// This is the handler for your serverless function
serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // No authentication check - allowing anonymous access
    const { url, type } = await req.json()
    
    console.log(`Processing ${type} request for URL: ${url}`);
    
    // Rest of your function code...