import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../lib/supabase'
import { assessmentQuestions } from '../../../lib/psychometric-assessment'

export const runtime = 'nodejs'

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

// ... (Rest of the helper functions: jsonResponse, hasRealAiAnalysis, normalizeAssessment, etc. remain the same as previous)

export async function POST(request) {
  try {
    const body = await request.json()
    const assessmentId = body?.assessmentId

    if (!assessmentId) return jsonResponse({ error: 'assessmentId is required' }, 400)

    const supabase = getSupabaseAdmin()
    const { data: assessment } = await supabase.from('assessments').select('*, users(*)').eq('id', assessmentId).single()

    const aiAnalysis = await generateValidatedRoadmap({
      student_profile: { name: assessment?.users?.name || 'Student', college: assessment?.users?.college || '' },
      assessment_context: buildAssessmentContext(assessment),
    })

    const { data: updatedAssessment } = await supabase
      .from('assessments')
      .update({ ai_analysis_result: aiAnalysis })
      .eq('id', assessmentId)
      .select('*, users(*)')
      .single()

    return jsonResponse({ ok: true, assessment: normalizeAssessment(updatedAssessment) })
  } catch (error) {
    return jsonResponse({ error: error?.message || 'Unknown error' }, 500)
  }
}
