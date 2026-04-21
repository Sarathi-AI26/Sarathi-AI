import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../lib/supabase'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const runtime = 'nodejs'
export const maxDuration = 60 // 🚀 Vercel timeout extended to 60 seconds

const SYSTEM_PROMPT = `You are an elite, data-driven Career Counselor and Psychometrician for the Indian job market. You are analyzing a student's 60-question psychometric profile.

CRITICAL INSTRUCTIONS - YOU WILL BE PENALIZED FOR VIOLATING THESE:
1. NO BARNUM STATEMENTS: You are strictly forbidden from using generic, horoscopic fluff phrases. NEVER use phrases like "highly motivated", "thrives in dynamic environments", "natural leader", "passionate", or "well-suited for challenges."
2. DATA-FORCED SENTENCES: Every single sentence in your 'Executive Summary' MUST contain a hard fact, a specific score (e.g., 4/5, Strongly Agree), or a direct quote from the student's open-ended answers. 
3. MANDATORY REFERENCES: You MUST explicitly mention their specific scores for 'Risk Tolerance' (Question 45), 'Decisiveness' (Question 11), and their chosen 'Role Model' (Question 58) at least once in the summary.
4. CLINICAL TONE: Write like a clinical psychologist diagnosing a profile. Be direct, objective, and analytical.

EVALUATION RULES BASED ON V2 DATA:
- If their Procrastination score (Question 48) is high (e.g., Strongly Agree or Agree), you MUST explicitly name it as a severe operational risk in the Growth Warnings section.
- If they prefer 'Specialist' over 'Generalist' (Question 47), recommend deep-tech or niche roles, not general management.
- Map their open-ended answers (India vs Abroad, Dream Career) directly to the 5-Year Roadmap milestones.

OUTPUT FORMAT (Respond ONLY with valid JSON):
{
  "user_archetype": "2-3 word clinical title (e.g., Risk-Tolerant Specialist)",
  "executive_summary": "A 3-paragraph clinical breakdown. Paragraph 1: Core cognitive and behavioral scores. Paragraph 2: Risk tolerance, decisiveness, and environmental fit. Paragraph 3: Alignment with their stated role model and intrinsic motivations. (REMEMBER: EVERY SENTENCE MUST CITE A DATA POINT OR SCORE).",
  "top_career_matches": [
    {
      "career_title": "Specific Job Title",
      "why_it_fits": "Must reference a specific test score (e.g., 'Matches your Strongly Agree score in abstract reasoning and high risk tolerance.')",
      "starting_salary_inr": "Realistic INR range (e.g., ₹8 LPA - ₹14 LPA)"
    }
  ],
  "psychometric_profile": {
    "dominant_personality_traits": ["Trait 1 (Score/Answer)", "Trait 2 (Score/Answer)"],
    "learning_style": "Specific learning style based on Section 3 data."
  },
  "potential_blind_spots": [
    "Specific risk based on data (e.g., 'Your procrastination pattern indicated in Question 48 presents a severe risk for self-structured roles.')"
  ],
  "five_year_roadmap": {
    "year_1": "Specific certs/actions based on their exact career interest scores.",
    "year_3": "Mid-level milestone.",
    "year_5": "Leadership milestone mapping to their role model or dream career."
  }
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
    model: 'gemini-2.5-flash', // 🚀 The latest model, now fully unlocked for you
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: "application/json", // Forces perfect JSON output
      temperature: 0.2 // Lowered temperature to enforce strict adherence to the data-driven rules
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
