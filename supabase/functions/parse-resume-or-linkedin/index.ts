
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { url, type } = await req.json()
    
    console.log(`Processing ${type} request for URL: ${url}`)
    
    // Get OpenAI API key from environment
    const openAiApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openAiApiKey) {
      console.error('OpenAI API key not found')
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    let parsedData
    
    if (type === 'resume') {
      // Download the file from the URL
      const fileResponse = await fetch(url)
      if (!fileResponse.ok) {
        throw new Error('Failed to download resume file')
      }

      // Use OpenAI to parse the resume
      const prompt = `
Please analyze this resume and extract the following information in JSON format:
{
  "name": "Full name",
  "role": "Current or desired job title",
  "location": "City, State/Country",
  "email": "Email address",
  "phone": "Phone number",
  "experience": [
    {
      "company": "Company name",
      "title": "Job title",
      "startDate": "YYYY-MM format",
      "endDate": "YYYY-MM or 'present'",
      "description": "Brief description of role and achievements"
    }
  ],
  "education": [
    {
      "school": "School/University name",
      "degree": "Degree name",
      "graduationDate": "YYYY-MM format"
    }
  ],
  "skills": ["skill1", "skill2", "skill3"],
  "achievements": ["achievement1", "achievement2"]
}

Please analyze the resume at: ${url}
`

      const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a resume parsing assistant. Extract information from resumes and return valid JSON only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1,
          max_tokens: 2000
        }),
      })

      if (!openAiResponse.ok) {
        const errorText = await openAiResponse.text()
        console.error('OpenAI API error:', errorText)
        throw new Error('Failed to parse resume with OpenAI')
      }

      const openAiData = await openAiResponse.json()
      const parsedContent = openAiData.choices[0].message.content

      try {
        parsedData = JSON.parse(parsedContent)
      } catch (parseError) {
        console.error('Failed to parse OpenAI JSON response:', parseError)
        throw new Error('Invalid response from AI parser')
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'LinkedIn parsing is not supported' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    return new Response(
      JSON.stringify(parsedData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error in parse function:', error)
    
    return new Response(
      JSON.stringify({ error: 'Failed to parse: ' + error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
