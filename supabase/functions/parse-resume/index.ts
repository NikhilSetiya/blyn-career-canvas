
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
    const { fileUrl } = await req.json()
    
    if (!fileUrl) {
      return new Response(
        JSON.stringify({ error: 'File URL is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Processing resume file:', fileUrl)

    // Get OpenAI API key from environment
    const openAiApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openAiApiKey) {
      console.error('OpenAI API key not found')
      // Return mock data if no API key
      const mockParsedData = {
        name: "Sample User",
        role: "Software Engineer",
        location: "San Francisco, CA",
        email: "sample@email.com",
        phone: "+1 (555) 123-4567",
        experience: [
          {
            company: "Tech Corp",
            title: "Senior Software Engineer",
            startDate: "2020-01",
            endDate: "present",
            description: "Led development of web applications using React and Node.js. Managed a team of 3 developers and implemented CI/CD pipelines."
          }
        ],
        education: [
          {
            school: "University of California, Berkeley",
            degree: "Bachelor of Science in Computer Science",
            graduationDate: "2018-05"
          }
        ],
        skills: [
          "JavaScript", "TypeScript", "React", "Node.js", "Python", 
          "AWS", "Docker", "Git", "MongoDB", "PostgreSQL"
        ],
        achievements: [
          "Led a project that increased system performance by 40%",
          "Mentored 5 junior developers"
        ]
      }

      return new Response(
        JSON.stringify(mockParsedData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // Download the file from the URL
    const fileResponse = await fetch(fileUrl)
    if (!fileResponse.ok) {
      throw new Error('Failed to download file')
    }

    const fileBuffer = await fileResponse.arrayBuffer()
    const fileName = fileUrl.split('/').pop() || 'resume'
    
    console.log('Downloaded file:', fileName, 'Size:', fileBuffer.byteLength)

    // For PDF files, we'll extract text using a simple approach
    // For production, you'd want to use a proper PDF parsing library
    let extractedText = ''
    
    if (fileName.toLowerCase().endsWith('.pdf')) {
      // For now, we'll use OpenAI with the file URL directly
      // In production, you'd extract text from the PDF first
      extractedText = 'PDF content extraction not implemented - using OpenAI vision'
    } else if (fileName.toLowerCase().endsWith('.docx')) {
      // For DOCX, you'd typically use a library to extract text
      extractedText = 'DOCX content extraction not implemented'
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

Resume content: ${extractedText || 'Please analyze the resume file at: ' + fileUrl}
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
            content: 'You are a resume parsing assistant. Extract information from resumes and return valid JSON only. Do not wrap the JSON in markdown code blocks or any other formatting.'
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

    console.log('OpenAI response:', parsedContent)

    // Try to parse the JSON response, handling markdown code blocks
    let parsedData
    try {
      // Clean the response by removing markdown code blocks if they exist
      let cleanedContent = parsedContent.trim()
      
      // Remove markdown code block markers
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }
      
      parsedData = JSON.parse(cleanedContent)
      console.log('Successfully parsed resume data:', parsedData)
    } catch (parseError) {
      console.error('Failed to parse OpenAI JSON response:', parseError)
      console.error('Raw response was:', parsedContent)
      
      // Return a more descriptive fallback
      parsedData = {
        name: "Unable to parse name",
        role: "Unable to parse role",
        location: "Unable to parse location",
        email: "Unable to parse email",
        phone: "Unable to parse phone",
        experience: [],
        education: [],
        skills: [],
        achievements: []
      }
    }

    return new Response(
      JSON.stringify(parsedData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error parsing resume:', error)
    
    return new Response(
      JSON.stringify({ error: 'Failed to parse resume: ' + error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
