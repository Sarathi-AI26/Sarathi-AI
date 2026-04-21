import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../lib/supabase'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const runtime = 'nodejs'
export const maxDuration = 60

// ─────────────────────────────────────────────
// QUESTION BANK — mirrors psychometric-assessment.js
// Labels let Gemini know exactly what each answer means
// ─────────────────────────────────────────────
const QUESTION_BANK = [
  // SECTION 1: PERSONALITY TRAITS (Q1–Q15) — Scale: 1=Strongly Agree, 5=Strongly Disagree
  { id: 1,  section: 'Personality',  dimension: 'analytical_thinking',   text: 'I enjoy solving problems that require deep thinking and analysis.' },
  { id: 2,  section: 'Personality',  dimension: 'structure_orientation',  text: 'I like having a clear plan and structure for my daily tasks.' },
  { id: 3,  section: 'Personality',  dimension: 'conflict_style',         text: 'When I disagree with someone in a group, I usually voice my opinion even if it creates tension.' },
  { id: 4,  section: 'Personality',  dimension: 'creativity',             text: 'I often think of creative ideas or new ways of doing things.' },
  { id: 5,  section: 'Personality',  dimension: 'stress_resilience',      text: 'I remain calm even during stressful situations.' },
  { id: 6,  section: 'Personality',  dimension: 'leadership_drive',       text: 'I naturally take the lead when working in a group.' },
  { id: 7,  section: 'Personality',  dimension: 'deliberation',           text: 'I think carefully before making important decisions.' },
  { id: 8,  section: 'Personality',  dimension: 'independence',           text: 'When facing an unfamiliar problem, I prefer to figure it out myself before asking for help.' },
  { id: 9,  section: 'Personality',  dimension: 'risk_aversion',          text: 'I avoid taking risks unless I am confident about the outcome.' },
  { id: 10, section: 'Personality',  dimension: 'adaptability',           text: 'I adapt quickly when situations change suddenly.' },
  { id: 11, section: 'Personality',  dimension: 'decisiveness',           text: 'I make important decisions quickly and course-correct later, rather than waiting until I am fully certain.' },
  { id: 12, section: 'Personality',  dimension: 'focus',                  text: 'I can stay focused on tasks for long periods without distraction.' },
  { id: 13, section: 'Personality',  dimension: 'cognitive_flexibility',  text: 'I find it easy to switch between very different tasks or subjects in the same day.' },
  { id: 14, section: 'Personality',  dimension: 'organization',           text: 'I like keeping my workspace and schedule organized.' },
  { id: 15, section: 'Personality',  dimension: 'empathy',                text: 'I often notice when someone is uncomfortable in a conversation, even if they do not say anything.' },

  // SECTION 2: CAREER INTERESTS (Q16–Q27) — Scale: 1=Very Interested, 4=Not Interested
  { id: 16, section: 'Career Interests', dimension: 'data_analytics',      text: 'Analyzing data, numbers, or patterns.' },
  { id: 17, section: 'Career Interests', dimension: 'design_media',        text: 'Designing visuals such as graphics, videos, or UI screens.' },
  { id: 18, section: 'Career Interests', dimension: 'technology',          text: 'Understanding how machines, software, or technology systems work.' },
  { id: 19, section: 'Career Interests', dimension: 'counselling_support', text: 'Helping people with academic, emotional, or career problems.' },
  { id: 20, section: 'Career Interests', dimension: 'leadership_mgmt',    text: 'Leading teams, planning events, or managing projects.' },
  { id: 21, section: 'Career Interests', dimension: 'writing_content',     text: 'Writing articles, blogs, scripts, or social media content.' },
  { id: 22, section: 'Career Interests', dimension: 'research',            text: 'Conducting research in science, humanities, commerce, or social studies.' },
  { id: 23, section: 'Career Interests', dimension: 'entrepreneurship',    text: 'Exploring business ideas, startups, or entrepreneurial ventures.' },
  { id: 24, section: 'Career Interests', dimension: 'healthcare',          text: 'Working in healthcare, medicine, nursing, or medical technology.' },
  { id: 25, section: 'Career Interests', dimension: 'finance_banking',     text: 'Working in finance, banking, investment, or insurance sectors.' },
  { id: 26, section: 'Career Interests', dimension: 'law_policy',          text: 'Working in law, policy-making, public administration, or governance.' },
  { id: 27, section: 'Career Interests', dimension: 'abroad_study',        text: 'Pursuing higher studies abroad for exposure and global career opportunities.' },

  // SECTION 3: APTITUDE INDICATORS (Q28–Q37) — Scale: 1=Strongly Agree, 5=Strongly Disagree
  { id: 28, section: 'Aptitude', dimension: 'teaching_ability',      text: 'My teachers or peers often ask me to explain concepts they find difficult.' },
  { id: 29, section: 'Aptitude', dimension: 'visual_reasoning',      text: 'I understand diagrams, charts, and visual data quickly.' },
  { id: 30, section: 'Aptitude', dimension: 'academic_strength',     text: 'In school or college, I consistently scored higher in Maths or Science than in other subjects.' },
  { id: 31, section: 'Aptitude', dimension: 'tech_learning_speed',   text: 'I learn new software or technology faster than most people.' },
  { id: 32, section: 'Aptitude', dimension: 'processing_speed',      text: 'When I read instructions for a new device or app, I rarely need to read them twice.' },
  { id: 33, section: 'Aptitude', dimension: 'problem_solving',       text: 'I can think of multiple solutions when faced with a problem.' },
  { id: 34, section: 'Aptitude', dimension: 'endurance',             text: 'I can stay focused even when tasks are repetitive or long.' },
  { id: 35, section: 'Aptitude', dimension: 'pattern_recognition',   text: 'I notice patterns or inconsistencies in data or information that others tend to miss.' },
  { id: 36, section: 'Aptitude', dimension: 'abstract_reasoning',    text: 'I easily understand abstract concepts like theories, algorithms, or frameworks.' },
  { id: 37, section: 'Aptitude', dimension: 'information_analysis',  text: 'I am comfortable analyzing large amounts of information to reach conclusions.' },

  // SECTION 4: MOTIVATION & CAREER DRIVERS (Q38–Q47) — Scale: 1=Very Important, 4=Not Important
  { id: 38, section: 'Motivation', dimension: 'salary_drive',        text: 'Earning a high salary early in my career.' },
  { id: 39, section: 'Motivation', dimension: 'job_security',        text: 'Having long-term job stability and security.' },
  { id: 40, section: 'Motivation', dimension: 'innovation_drive',    text: 'Having opportunities to innovate or build new ideas.' },
  { id: 41, section: 'Motivation', dimension: 'leadership_ambition', text: 'Getting leadership roles and recognition at work.' },
  { id: 42, section: 'Motivation', dimension: 'work_life_balance',   text: 'Having a good work-life balance and manageable workload.' },
  { id: 43, section: 'Motivation', dimension: 'social_impact',       text: 'Contributing to society and making a positive impact.' },
  { id: 44, section: 'Motivation', dimension: 'global_exposure',     text: 'Working in roles that allow international travel or relocation.' },
  { id: 45, section: 'Motivation', dimension: 'risk_tolerance',      text: 'Being able to take calculated risks and try new things, even if some fail.' },
  { id: 46, section: 'Motivation', dimension: 'family_approval',     text: 'Having my family\'s approval and support for my career choices.' },
  { id: 47, section: 'Motivation', dimension: 'specialist_vs_generalist', text: 'Mastering a specific skill or subject deeply, rather than knowing a little of many things.' },

  // SECTION 5: BEHAVIOURAL TENDENCIES (Q48–Q55) — Scale: 1=Strongly Agree, 5=Strongly Disagree
  // NOTE: Q48 is REVERSE-SCORED (1=Strongly Agree means high procrastination)
  { id: 48, section: 'Behavioural', dimension: 'procrastination',    text: 'When I have a long deadline, I tend to start seriously only in the final few days.', reverse: true },
  { id: 49, section: 'Behavioural', dimension: 'stress_response',    text: 'I feel stressed when too many tasks pile up at once.' },
  { id: 50, section: 'Behavioural', dimension: 'team_orientation',   text: 'I enjoy collaborating with others and working in teams.' },
  { id: 51, section: 'Behavioural', dimension: 'team_commitment',    text: 'If I disagree with how a team decision was made, I find it hard to commit fully to it.' },
  { id: 52, section: 'Behavioural', dimension: 'feedback_receptivity', text: 'I actively use feedback to improve myself.' },
  { id: 53, section: 'Behavioural', dimension: 'public_speaking',    text: 'I feel confident presenting or speaking in front of groups.' },
  { id: 54, section: 'Behavioural', dimension: 'grit',               text: 'I tend to keep trying a difficult problem even after multiple failures, rather than moving on.' },
  { id: 55, section: 'Behavioural', dimension: 'intrinsic_curiosity', text: 'I often research a topic extensively on my own, beyond what was required in class.' },

  // SECTION 6: OPEN-ENDED (Q56–Q60) — Free text
  { id: 56, section: 'Open-Ended', dimension: 'dream_career',        text: 'What is your dream career, and why does it inspire you?' },
  { id: 57, section: 'Open-Ended', dimension: 'challenge_overcome',  text: 'Describe a challenge you faced and how you overcame it.' },
  { id: 58, section: 'Open-Ended', dimension: 'role_model',          text: 'Name one person — real or fictional — whose career or life you admire most, and explain what specifically about their path appeals to you.' },
  { id: 59, section: 'Open-Ended', dimension: 'intrinsic_motivation', text: 'If money was not a concern, what would you spend most of your time doing? How close is that to what you are currently pursuing?' },
  { id: 60, section: 'Open-Ended', dimension: 'india_vs_abroad',     text: 'Would you prefer building your career in India, abroad, or both? Why?' },
]

const SCALE_LABELS = {
  Personality:  ['', 'Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
  Aptitude:     ['', 'Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
  Behavioural:  ['', 'Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
  'Career Interests': ['', 'Very Interested', 'Interested', 'Neutral', 'Not Interested'],
  Motivation:   ['', 'Very Important', 'Important', 'Neutral', 'Not Important'],
  'Open-Ended': null,
}

// ─────────────────────────────────────────────
// SYSTEM PROMPT
// ─────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an elite career psychometrician and counsellor specialising in the Indian job market. You receive a fully labelled psychometric profile for an Indian college student and produce a deeply personalised career roadmap.

ABSOLUTE RULES — VIOLATIONS WILL INVALIDATE THE REPORT:
1. ZERO BARNUM STATEMENTS: Never use "highly motivated", "thrives in dynamic environments", "natural leader", "passionate about learning", "well-suited for challenges", "strong communicator", or any phrase that could apply to any student. Every statement must be falsifiable — it must be possible for it to NOT apply to someone.
2. CITE DATA IN EVERY SENTENCE: The executive summary must reference a specific dimension score, a Likert label, or a direct quote from open-ended answers in every sentence. No sentence may float without evidence.
3. MANDATORY CALLOUTS: You must explicitly mention the student's exact scores for Risk Tolerance (Q45), Decisiveness (Q11), and their Role Model answer (Q58) at least once each in the executive summary.
4. PROCRASTINATION FLAG: If Q48 (procrastination) is Strongly Agree or Agree, it MUST appear as the first item in potential_blind_spots with the label "SEVERE OPERATIONAL RISK".
5. SPECIALIST VS GENERALIST: If Q47 is Very Important or Important, only recommend deep-specialist roles. Never recommend "General Manager" or "Business Development" type roles for these students.
6. FAMILY APPROVAL: If Q46 (family approval) is Very Important or Important, add a note in the roadmap about choosing careers that are legible to Indian families (e.g., engineering, medicine, law, CA, MBA).
7. ROLE MODEL MIRROR: The Year 5 roadmap milestone must explicitly connect to the student's stated role model (Q58). If they admire a founder, Year 5 = founding something. If they admire a scientist, Year 5 = publishing or leading research.
8. INDIA VS ABROAD ROUTING: If Q60 mentions abroad, include at least one international milestone in the 5-year roadmap (e.g., GRE prep in Year 1, foreign internship in Year 2).
9. SECTOR ACCURACY: Match top career paths to the student's highest-scoring interest dimensions, not to generic "top careers in India". A student with high healthcare interest must get healthcare careers, not tech.
10. CLINICAL TONE: Write like a senior psychologist reading a case file. Direct, specific, no cheerleading.

OUTPUT: Respond ONLY with valid JSON in the exact schema below.`

// ─────────────────────────────────────────────
// SCORE COMPUTATION
// ─────────────────────────────────────────────

/**
 * Converts raw answers to section-level scores (0–100)
 * Likert sections: lower raw score = stronger trait (1=SA=best)
 * Interest/Motivation: lower raw score = higher interest/importance
 * Reverse-scored questions are inverted before aggregation
 */
function computeSectionScores(rawAnswers) {
  const sectionData = {}

  QUESTION_BANK.forEach((q, idx) => {
    const raw = parseInt(rawAnswers[idx], 10)
    if (isNaN(raw) || q.section === 'Open-Ended') return

    if (!sectionData[q.section]) sectionData[q.section] = []

    const scale = q.section === 'Career Interests' ? 4 : 
                  q.section === 'Motivation' ? 4 : 5

    // Reverse-score procrastination (Q48): SA=high procrastination=bad
    const value = q.reverse ? raw : (scale + 1 - raw)
    sectionData[q.section].push({ value, max: scale, dimension: q.dimension })
  })

  const scores = {}
  for (const [section, items] of Object.entries(sectionData)) {
    const total = items.reduce((sum, i) => sum + i.value, 0)
    const maxTotal = items.reduce((sum, i) => sum + i.max, 0)
    scores[section] = Math.round((total / maxTotal) * 100)
  }
  return scores
}

/**
 * Extracts key individual dimension scores for the prompt
 */
function extractKeySignals(rawAnswers) {
  const signals = {}
  QUESTION_BANK.forEach((q, idx) => {
    const raw = parseInt(rawAnswers[idx], 10)
    const scale = q.section === 'Career Interests' ? 4 :
                  q.section === 'Motivation' ? 4 : 5
    const labels = SCALE_LABELS[q.section]
    signals[q.dimension] = {
      raw,
      label: labels ? (labels[raw] || raw) : rawAnswers[idx],
      score_pct: q.section === 'Open-Ended' ? null :
        Math.round(((scale + 1 - (q.reverse ? raw : raw)) / scale) * 100)
    }
  })
  return signals
}

// ─────────────────────────────────────────────
// CONTEXT BUILDER — the richer the context, the better the output
// ─────────────────────────────────────────────
function buildAssessmentContext(assessment) {
  if (!assessment?.raw_answers) return 'No answers provided.'

  const answers = assessment.raw_answers
  const sectionScores = computeSectionScores(answers)
  const signals = extractKeySignals(answers)

  const lines = []

  // Section scores summary
  lines.push('=== COMPUTED SECTION SCORES (0-100, higher = stronger) ===')
  for (const [section, score] of Object.entries(sectionScores)) {
    lines.push(`${section}: ${score}/100`)
  }

  lines.push('\n=== KEY DIAGNOSTIC SIGNALS ===')
  lines.push(`Decisiveness (Q11): ${signals.decisiveness?.label} — ${signals.decisiveness?.raw <= 2 ? 'Acts fast, corrects later. Entrepreneur-compatible.' : 'Prefers certainty before acting. Corporate-track compatible.'}`)
  lines.push(`Risk Tolerance (Q45): ${signals.risk_tolerance?.label} — ${signals.risk_tolerance?.raw <= 2 ? 'HIGH risk tolerance. Startup/founder path viable.' : 'LOW risk tolerance. Stable corporate/government path preferred.'}`)
  lines.push(`Procrastination (Q48): ${signals.procrastination?.label} — ${signals.procrastination?.raw <= 2 ? 'SEVERE RISK: Deadline-only worker. Unsuitable for self-structured roles.' : 'Proactive worker. Self-managed roles viable.'}`)
  lines.push(`Specialist vs Generalist (Q47): ${signals.specialist_vs_generalist?.label} — ${signals.specialist_vs_generalist?.raw <= 2 ? 'Deep specialist preference. Recommend niche/expert roles.' : 'Generalist preference. Management/cross-functional roles viable.'}`)
  lines.push(`Family Approval (Q46): ${signals.family_approval?.label} — ${signals.family_approval?.raw <= 2 ? 'Family approval is critical. Recommend careers legible to Indian families.' : 'Career autonomy from family. Can explore unconventional paths.'}`)
  lines.push(`Global Ambition (Q44 + Q27): Travel/relocation = ${signals.global_exposure?.label}, Abroad study interest = ${signals.abroad_study?.label}`)

  lines.push('\n=== FULL LABELLED ANSWERS ===')
  QUESTION_BANK.forEach((q, idx) => {
    const rawVal = answers[idx]
    const labels = SCALE_LABELS[q.section]
    const displayVal = labels ? (labels[parseInt(rawVal)] || rawVal) : rawVal
    lines.push(`Q${q.id} [${q.section} / ${q.dimension}]: "${q.text}" → ${displayVal}`)
  })

  lines.push('\n=== OPEN-ENDED ANSWERS (AI must quote these directly) ===')
  QUESTION_BANK.filter(q => q.section === 'Open-Ended').forEach((q, idx) => {
    const ansIdx = 55 + idx // Q56 is index 55
    lines.push(`Q${q.id} — ${q.dimension}:\n"${answers[ansIdx] || 'No answer provided'}"`)
  })

  return lines.join('\n')
}

// ─────────────────────────────────────────────
// JSON SCHEMA passed as part of user prompt for strict structure
// ─────────────────────────────────────────────
const OUTPUT_SCHEMA = `{
  "user_archetype": "2-3 word clinical label derived from top dimension scores (NOT a generic label)",
  "executive_summary": {
    "paragraph_1": "Core cognitive and behavioural scores. EVERY sentence cites a score or dimension label.",
    "paragraph_2": "Risk tolerance (cite Q45 score), decisiveness (cite Q11 score), and environmental fit.",
    "paragraph_3": "Direct connection to their stated role model (Q58) and the gap between Q59 (intrinsic motivation) and their current path."
  },
  "radar_chart_scores": {
    "Personality": 0,
    "Aptitude": 0,
    "Motivation": 0,
    "Career Interests": 0,
    "Behavioural Tendencies": 0
  },
  "top_career_matches": [
    {
      "career_title": "Specific Job Title",
      "match_reason": "Must cite the specific dimension scores that make this a match.",
      "growth_path": "Junior role → Mid role → Senior role in 5 years.",
      "starting_salary_inr": "Realistic Indian market range e.g. ₹8 LPA - ₹14 LPA",
      "key_certifications": ["Cert 1", "Cert 2"]
    }
  ],
  "psychometric_profile": {
    "dominant_personality_traits": ["Trait (evidence from score)", "Trait (evidence from score)"],
    "learning_style": "Specific style derived from Section 3 aptitude data.",
    "work_environment_fit": "Specific environment type with reasoning from behavioural scores.",
    "collaboration_style": "How they work with others, based on Q3, Q50, Q51 scores."
  },
  "potential_blind_spots": [
    "SEVERE OPERATIONAL RISK (if Q48 <= 2): specific procrastination warning.",
    "Other specific risk with score citation."
  ],
  "immediate_action_plan": {
    "next_30_days": "One concrete, measurable action step this month.",
    "next_90_days": "One skill or credential to pursue in 3 months.",
    "success_metric": "Exactly how to measure completion."
  },
  "five_year_roadmap": {
    "year_1": "Foundation — specific certifications, exams, or internships based on top career match.",
    "year_2": "Skill Application — first real role or specialised project. Include abroad milestone if Q60 mentions it.",
    "year_3": "Market Acceleration — mid-level target role with salary expectation.",
    "year_4": "Strategic Positioning — networking, advanced credentials, or entrepreneurial groundwork.",
    "year_5": "Leadership milestone explicitly modelled on their Q58 role model."
  },
  "india_vs_abroad_guidance": "Specific routing advice based on Q60 answer and Q27 (abroad study interest) score."
}`

// ─────────────────────────────────────────────
// GEMINI CALL
// ─────────────────────────────────────────────
async function generateValidatedRoadmap(promptData) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY environment variable')
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

  // 🚀 FIX: Swapped to the more robust gemini-2.5-pro model to bypass the traffic jam
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-pro',
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.25,
    },
  })

  const userPrompt = `
STUDENT PROFILE:
Name: ${promptData.student_profile.name}
College: ${promptData.student_profile.college}

${promptData.assessment_context}

REQUIRED OUTPUT SCHEMA (return ONLY valid JSON matching this exactly):
${OUTPUT_SCHEMA}

FINAL REMINDER BEFORE YOU WRITE:
- Did you cite Q11 (decisiveness) in the executive summary? 
- Did you cite Q45 (risk tolerance) in the executive summary?
- Did you quote Q58 (role model) directly in the executive summary?
- Did you check Q48 (procrastination) and add a SEVERE OPERATIONAL RISK warning if score <= 2?
- Does Year 5 roadmap mirror the Q58 role model's path?
- Does the india_vs_abroad_guidance field reflect Q60's exact answer?
`

  const result = await model.generateContent(userPrompt)
  const responseText = result.response.text()

  return JSON.parse(responseText)
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const jsonResponse = (data, status = 200) => NextResponse.json(data, { status })

const normalizeAssessment = (assessment) => {
  if (!assessment) return null
  return {
    ...assessment,
    ai_analysis: assessment.ai_analysis_result || assessment.ai_analysis,
  }
}

// ─────────────────────────────────────────────
// POST HANDLER
// ─────────────────────────────────────────────
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

    const aiAnalysis = await generateValidatedRoadmap({
      student_profile: {
        name: assessment?.users?.name || 'Student',
        college: assessment?.users?.college || '',
      },
      assessment_context: buildAssessmentContext(assessment),
    })

    const { data: updatedAssessment, error: updateError } = await supabase
      .from('assessments')
      .update({ ai_analysis_result: aiAnalysis })
      .eq('id', assessmentId)
      .select('*, users(*)')
      .single()

    if (updateError) {
      console.error('Supabase Update Error:', updateError)
      return jsonResponse({ error: 'Failed to save analysis to database' }, 500)
    }

    return jsonResponse({ ok: true, assessment: normalizeAssessment(updatedAssessment) })

  } catch (error) {
    console.error('Roadmap Generation Failed:', error)
    return jsonResponse({ error: error?.message || 'AI Generation Failed' }, 500)
  }
}
