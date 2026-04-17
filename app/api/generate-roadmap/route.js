import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../lib/supabase'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const runtime = 'nodejs'
export const maxDuration = 60 // 🚀 Vercel timeout extended to 60 seconds

const SYSTEM_PROMPT = `You are an expert Career Counselor for the SARATHI App. 
Your goal is to provide a 5-year strategic transformation roadmap for an Indian college student.

TONE & STYLE:
- Address the student directly as "You".
- Provide high-impact, actionable steps tailored to the Indian market.

Output a structured JSON response with exactly this format:
{
  "user_archetype": "A catchy 2-3 word title",
  "executive_summary": "3 paragraphs: Strengths, Work Style, and 5-Year Vision.",
  "psychometric_profile": {
    "dominant_personality_traits": ["Trait 1", "Trait 2"],
    "core_motivators": ["Motivator 1", "Motivator 2"],
    "learning_style": "How they best absorb info"
  },
  "top_career_matches": [
    {
      "career_title": "Specific Role",
      "why_it_fits": "2 sentences explaining the match",
      "starting_salary_inr": "₹XL - ₹YL PA",
      "growth_potential": "High/Explosive"
    }
  ],
  "five_year_roadmap": {
    "year_1": "Foundation: Specific skills, certifications, and first job/internship targets.",
    "year_3": "Acceleration: Moving into specialized roles or mid-level management.",
    "year_5": "Leadership: Reaching senior roles, starting a venture, or global specialized expert status."
  },
  "potential_blind_spots": ["Constructive feedback"]
}`

// --- HELPER FUNCTIONS ---

const jsonResponse = (data, status = 200) => NextResponse.json(data, { status })

const buildAssessmentContext = (assessment) => {
  if (!assessment || !assessment.raw_answers) return "No answers provided."
  return assessment.raw_answers.map((ans, i) => `Question ${i + 1}: ${ans}`).join('\n')
}

const normalizeAssessment = (assessment) => {
  if (!assessment) return null
  return {
    ...assessment,
    // Ensures frontend always finds the data regardless of column naming
    ai_analysis: assessment.ai_analysis_result || assessment.ai_analysis 
  }
}

// 🚀 THE ENGINE UPGRADE: Using the high-speed Flash model
async function generateValidatedRoadmap(promptData) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY environment variable")
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  
  // Using Flash for real-time mobile performance
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: "application/json", // Forces perfect JSON output
      temperature: 0.7
    }
  })

  const userPrompt = `
    Student Profile:
    Name: ${promptData.student_profile.name}
    College: ${promptData.student_profile.college}

    Assessment Answers:
    ${promptData.assessment_context}
  `

  const result = await model.generateContent(userPrompt)
  const responseText = result.response.text()
  
  return JSON.parse(responseText)
}

// --- MAIN API ROUTE ---

export async function POST(request) {
  try {
    const body = await request.json()
    const assessmentId = body?.assessmentId

    if (!assessmentId) return jsonResponse({ error: 'assessmentId is required' }, 400)

    const supabase = getSupabaseAdmin()
    const { data: assessment, error: fetchError } = await supabase
      .from('assessments')
      .select('*, users(*)')
      .eq('id', assessmentId)
      .single()

    if (fetchError || !assessment) {
      return jsonResponse({ error: 'Assessment not found' }, 404)
    }

    // Generate the AI Roadmap using the high-speed engine
    const aiAnalysis = await generateValidatedRoadmap({
      student_profile: { 
        name: assessment?.users?.name || 'Student', 
        college: assessment?.users?.college || '' 
      },
      assessment_context: buildAssessmentContext(assessment),
    })

    // Save the result back to Supabase
    const { data: updatedAssessment, error: updateError } = await supabase
      .from('assessments')
      .update({ ai_analysis_result: aiAnalysis })
      .eq('id', assessmentId)
      .select('*, users(*)')
      .single()

    if (updateError) {
      console.error("Supabase Update Error:", updateError)
      return jsonResponse({ error: 'Failed to save analysis to database' }, 500)
    }

    return jsonResponse({ ok: true, assessment: normalizeAssessment(updatedAssessment) })

  } catch (error) {
    console.error("Roadmap Generation Failed:", error)
    return jsonResponse({ error: error?.message || 'AI Generation Failed' }, 500)
  }
}
