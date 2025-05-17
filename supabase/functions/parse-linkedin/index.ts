import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import puppeteer from 'https://deno.land/x/puppeteer@16.2.0/mod.ts'

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
    const { url } = await req.json()
    
    if (!url || !url.includes('linkedin.com/in/')) {
      return new Response(
        JSON.stringify({ error: 'Invalid LinkedIn URL' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Launch browser
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    
    const page = await browser.newPage()
    
    // Set viewport and user agent
    await page.setViewport({ width: 1280, height: 800 })
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
    
    // Navigate to LinkedIn profile
    await page.goto(url, { waitUntil: 'networkidle2' })
    
    // Extract profile data
    const profileData = await page.evaluate(() => {
      // Basic info
      const nameElement = document.querySelector('.text-heading-xlarge')
      const headlineElement = document.querySelector('.text-body-medium')
      const locationElement = document.querySelector('.text-body-small.inline.t-black--light.break-words')
      
      // Experience
      const experienceElements = Array.from(document.querySelectorAll('#experience-section .pv-entity__position-group-pager, #experience-section .pv-profile-section__card-item'))
      const experience = experienceElements.map(item => {
        const titleElement = item.querySelector('.pv-entity__summary-info h3, .t-16.t-black.t-bold')
        const companyElement = item.querySelector('.pv-entity__secondary-title, .pv-entity__company-summary-info span:first-child')
        const dateRangeElement = item.querySelector('.pv-entity__date-range span:nth-child(2), .t-14.t-normal.t-black--light span:nth-child(2)')
        const descriptionElement = item.querySelector('.pv-entity__description')
        
        return {
          title: titleElement?.textContent?.trim() || '',
          company: companyElement?.textContent?.trim() || '',
          dateRange: dateRangeElement?.textContent?.trim() || '',
          description: descriptionElement?.textContent?.trim() || ''
        }
      })
      
      // Education
      const educationElements = Array.from(document.querySelectorAll('#education-section .pv-profile-section__card-item, #education-section .pv-education-entity'))
      const education = educationElements.map(item => {
        const schoolElement = item.querySelector('.pv-entity__school-name, .t-16.t-black.t-bold')
        const degreeElement = item.querySelector('.pv-entity__degree-name span:nth-child(2), .pv-entity__secondary-title.pv-entity__degree-name span:nth-child(2)')
        const fieldElement = item.querySelector('.pv-entity__fos span:nth-child(2), .pv-entity__secondary-title.pv-entity__fos span:nth-child(2)')
        const dateRangeElement = item.querySelector('.pv-entity__dates span:nth-child(2), .t-14.t-normal.t-black--light span:nth-child(2)')
        
        return {
          school: schoolElement?.textContent?.trim() || '',
          degree: degreeElement?.textContent?.trim() || '',
          field: fieldElement?.textContent?.trim() || '',
          dateRange: dateRangeElement?.textContent?.trim() || ''
        }
      })
      
      // Skills
      const skillElements = Array.from(document.querySelectorAll('.pv-skill-category-entity__name-text, .pv-skill-category-entity .t-16'))
      const skills = skillElements.map(item => item.textContent?.trim() || '').filter(Boolean)
      
      return {
        name: nameElement?.textContent?.trim() || '',
        headline: headlineElement?.textContent?.trim() || '',
        location: locationElement?.textContent?.trim() || '',
        experience,
        education,
        skills
      }
    })
    
    await browser.close()
    
    // Process the data into a more structured format
    const processedData = {
      name: profileData.name,
      headline: profileData.headline,
      location: profileData.location,
      experience: profileData.experience.map(exp => {
        // Parse date range
        const dateRange = exp.dateRange.split(' – ')
        return {
          title: exp.title,
          company: exp.company,
          startDate: dateRange[0] || '',
          endDate: dateRange[1] || 'Present',
          description: exp.description
        }
      }),
      education: profileData.education.map(edu => {
        // Parse date range
        const dateRange = edu.dateRange.split(' – ')
        return {
          school: edu.school,
          degree: `${edu.degree}${edu.field ? `, ${edu.field}` : ''}`,
          startDate: dateRange[0] || '',
          endDate: dateRange[1] || ''
        }
      }),
      skills: profileData.skills
    }

    return new Response(
      JSON.stringify(processedData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error parsing LinkedIn profile:', error)
    
    return new Response(
      JSON.stringify({ error: 'Failed to parse LinkedIn profile' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})