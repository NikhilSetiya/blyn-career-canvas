
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

    // For now, we'll return mock parsed data since we need OpenAI API for actual parsing
    // In a real implementation, you would:
    // 1. Download the file from the URL
    // 2. Extract text from PDF/DOCX
    // 3. Use OpenAI to parse and structure the data

    const mockParsedData = {
      name: "John Doe",
      role: "Software Engineer",
      location: "San Francisco, CA",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      experience: [
        {
          company: "Tech Corp",
          title: "Senior Software Engineer",
          startDate: "2020-01",
          endDate: "present",
          description: "Led development of web applications using React and Node.js. Managed a team of 3 developers and implemented CI/CD pipelines."
        },
        {
          company: "StartupXYZ",
          title: "Full Stack Developer",
          startDate: "2018-06",
          endDate: "2019-12",
          description: "Developed full-stack applications using MEAN stack. Built RESTful APIs and responsive front-end interfaces."
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
        "Mentored 5 junior developers",
        "Published 2 technical articles on software architecture"
      ]
    }

    return new Response(
      JSON.stringify(mockParsedData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error parsing resume:', error)
    
    return new Response(
      JSON.stringify({ error: 'Failed to parse resume' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
