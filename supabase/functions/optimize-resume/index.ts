
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobDescription, resumeContent } = await req.json();

    const prompt = `
You are an ATS (Applicant Tracking System) expert and career coach. Analyze the following resume against the job description and provide detailed feedback.

JOB DESCRIPTION:
${jobDescription}

RESUME CONTENT:
${resumeContent}

Please provide a JSON response with the following structure:
{
  "overallScore": number (0-100),
  "sectionScores": {
    "summary": number (0-100),
    "experience": number (0-100),
    "skills": number (0-100),
    "education": number (0-100)
  },
  "missingKeywords": [array of important keywords from job description not found in resume],
  "suggestions": [array of specific actionable suggestions to improve the resume],
  "optimizedContent": "rewritten resume content optimized for this job description"
}

Focus on:
1. Keyword matching and ATS compatibility
2. Relevance of experience to job requirements
3. Skills alignment
4. Overall presentation and structure
5. Missing critical elements

Be specific and actionable in your suggestions.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert ATS analyzer and career coach. Always respond with valid JSON only, no markdown formatting or code blocks.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content;

    // Clean up any markdown formatting that might be present
    content = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
    
    // Parse the cleaned content
    const result = JSON.parse(content);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in optimize-resume function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze resume',
        details: error.message 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
