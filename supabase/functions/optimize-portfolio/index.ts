
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
    const { jobDescription, portfolioContent } = await req.json();

    const prompt = `
You are a portfolio optimization expert and career coach. Analyze the following portfolio against the job description and provide detailed feedback.

JOB DESCRIPTION:
${jobDescription}

PORTFOLIO CONTENT:
${portfolioContent}

Please provide a JSON response with the following structure:
{
  "overallScore": number (0-100),
  "sectionScores": {
    "projects": number (0-100),
    "skills": number (0-100),
    "about": number (0-100),
    "contact": number (0-100)
  },
  "missingKeywords": [array of important technologies/skills from job description not showcased in portfolio],
  "suggestions": [array of specific actionable suggestions to improve the portfolio],
  "optimizedContent": "rewritten portfolio descriptions optimized for this job description"
}

Focus on:
1. Technical skills alignment with job requirements
2. Project relevance and complexity
3. Technology stack matching
4. Portfolio presentation and user experience
5. Missing critical projects or skills demonstrations
6. Professional branding and positioning

Be specific and actionable in your suggestions for portfolio improvements.
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
            content: 'You are an expert portfolio analyzer and career coach. Always respond with valid JSON only.'
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
    const result = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in optimize-portfolio function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze portfolio',
        details: error.message 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
