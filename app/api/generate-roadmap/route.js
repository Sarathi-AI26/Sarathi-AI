import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../lib/supabase'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const runtime = 'nodejs'
export const maxDuration = 60

// ─────────────────────────────────────────────
// QUESTION BANK
// ─────────────────────────────────────────────
const QUESTION_BANK = [
  { id: 1,  section: 'Personality',      dimension: 'analytical_thinking',      text: 'I enjoy solving problems that require deep thinking and analysis.' },
  { id: 2,  section: 'Personality',      dimension: 'structure_orientation',    text: 'I like having a clear plan and structure for my daily tasks.' },
  { id: 3,  section: 'Personality',      dimension: 'conflict_style',           text: 'When I disagree with someone in a group, I usually voice my opinion even if it creates tension.' },
  { id: 4,  section: 'Personality',      dimension: 'creativity',               text: 'I often think of creative ideas or new ways of doing things.' },
  { id: 5,  section: 'Personality',      dimension: 'stress_resilience',        text: 'I remain calm even during stressful situations.' },
  { id: 6,  section: 'Personality',      dimension: 'leadership_drive',         text: 'I naturally take the lead when working in a group.' },
  { id: 7,  section: 'Personality',      dimension: 'deliberation',             text: 'I think carefully before making important decisions.' },
  { id: 8,  section: 'Personality',      dimension: 'independence',             text: 'When facing an unfamiliar problem, I prefer to figure it out myself before asking for help.' },
  { id: 9,  section: 'Personality',      dimension: 'risk_aversion',            text: 'I avoid taking risks unless I am confident about the outcome.' },
  { id: 10, section: 'Personality',      dimension: 'adaptability',             text: 'I adapt quickly when situations change suddenly.' },
  { id: 11, section: 'Personality',      dimension: 'decisiveness',             text: 'I make important decisions quickly and course-correct later, rather than waiting until I am fully certain.' },
  { id: 12, section: 'Personality',      dimension: 'focus',                    text: 'I can stay focused on tasks for long periods without distraction.' },
  { id: 13, section: 'Personality',      dimension: 'cognitive_flexibility',    text: 'I find it easy to switch between very different tasks or subjects in the same day.' },
  { id: 14, section: 'Personality',      dimension: 'organization',             text: 'I like keeping my workspace and schedule organized.' },
  { id: 15, section: 'Personality',      dimension: 'empathy',                  text: 'I often notice when someone is uncomfortable in a conversation, even if they do not say anything.' },
  { id: 16, section: 'Career Interests', dimension: 'data_analytics',           text: 'Analyzing data, numbers, or patterns.' },
  { id: 17, section: 'Career Interests', dimension: 'design_media',             text: 'Designing visuals such as graphics, videos, or UI screens.' },
  { id: 18, section: 'Career Interests', dimension: 'technology',               text: 'Understanding how machines, software, or technology systems work.' },
  { id: 19, section: 'Career Interests', dimension: 'counselling_support',      text: 'Helping people with academic, emotional, or career problems.' },
  { id: 20, section: 'Career Interests', dimension: 'leadership_mgmt',          text: 'Leading teams, planning events, or managing projects.' },
  { id: 21, section: 'Career Interests', dimension: 'writing_content',          text: 'Writing articles, blogs, scripts, or social media content.' },
  { id: 22, section: 'Career Interests', dimension: 'research',                 text: 'Conducting research in science, humanities, commerce, or social studies.' },
  { id: 23, section: 'Career Interests', dimension: 'entrepreneurship',         text: 'Exploring business ideas, startups, or entrepreneurial ventures.' },
  { id: 24, section: 'Career Interests', dimension: 'healthcare',               text: 'Working in healthcare, medicine, nursing, or medical technology.' },
  { id: 25, section: 'Career Interests', dimension: 'finance_banking',          text: 'Working in finance, banking, investment, or insurance sectors.' },
  { id: 26, section: 'Career Interests', dimension: 'law_policy',               text: 'Working in law, policy-making, public administration, or governance.' },
  { id: 27, section: 'Career Interests', dimension: 'abroad_study',             text: 'Pursuing higher studies abroad for exposure and global career opportunities.' },
  { id: 28, section: 'Aptitude',         dimension: 'teaching_ability',         text: 'My teachers or peers often ask me to explain concepts they find difficult.' },
  { id: 29, section: 'Aptitude',         dimension: 'visual_reasoning',         text: 'I understand diagrams, charts, and visual data quickly.' },
  { id: 30, section: 'Aptitude',         dimension: 'academic_strength',        text: 'In school or college, I consistently scored higher in Maths or Science than in other subjects.' },
  { id: 31, section: 'Aptitude',         dimension: 'tech_learning_speed',      text: 'I learn new software or technology faster than most people.' },
  { id: 32, section: 'Aptitude',         dimension: 'processing_speed',         text: 'When I read instructions for a new device or app, I rarely need to read them twice.' },
  { id: 33, section: 'Aptitude',         dimension: 'problem_solving',          text: 'I can think of multiple solutions when faced with a problem.' },
  { id: 34, section: 'Aptitude',         dimension: 'endurance',                text: 'I can stay focused even when tasks are repetitive or long.' },
  { id: 35, section: 'Aptitude',         dimension: 'pattern_recognition',      text: 'I notice patterns or inconsistencies in data or information that others tend to miss.' },
  { id: 36, section: 'Aptitude',         dimension: 'abstract_reasoning',       text: 'I easily understand abstract concepts like theories, algorithms, or frameworks.' },
  { id: 37, section: 'Aptitude',         dimension: 'information_analysis',     text: 'I am comfortable analyzing large amounts of information to reach conclusions.' },
  { id: 38, section: 'Motivation',       dimension: 'salary_drive',             text: 'Earning a high salary early in my career.' },
  { id: 39, section: 'Motivation',       dimension: 'job_security',             text: 'Having long-term job stability and security.' },
  { id: 40, section: 'Motivation',       dimension: 'innovation_drive',         text: 'Having opportunities to innovate or build new ideas.' },
  { id: 41, section: 'Motivation',       dimension: 'leadership_ambition',      text: 'Getting leadership roles and recognition at work.' },
  { id: 42, section: 'Motivation',       dimension: 'work_life_balance',        text: 'Having a good work-life balance and manageable workload.' },
  { id: 43, section: 'Motivation',       dimension: 'social_impact',            text: 'Contributing to society and making a positive impact.' },
  { id: 44, section: 'Motivation',       dimension: 'global_exposure',          text: 'Working in roles that allow international travel or relocation.' },
  { id: 45, section: 'Motivation',       dimension: 'risk_tolerance',           text: 'Being able to take calculated risks and try new things, even if some fail.' },
  { id: 46, section: 'Motivation',       dimension: 'family_approval',          text: 'Having my family\'s approval and support for my career choices.' },
  { id: 47, section: 'Motivation',       dimension: 'specialist_vs_generalist', text: 'Mastering a specific skill or subject deeply, rather than knowing a little of many things.' },
  { id: 48, section: 'Behavioural',      dimension: 'procrastination',          text: 'When I have a long deadline, I tend to start seriously only in the final few days.', reverse: true },
  { id: 49, section: 'Behavioural',      dimension: 'stress_response',          text: 'I feel stressed when too many tasks pile up at once.' },
  { id: 50, section: 'Behavioural',      dimension: 'team_orientation',         text: 'I enjoy collaborating with others and working in teams.' },
  { id: 51, section: 'Behavioural',      dimension: 'team_commitment',          text: 'If I disagree with how a team decision was made, I find it hard to commit fully to it.' },
  { id: 52, section: 'Behavioural',      dimension: 'feedback_receptivity',     text: 'I actively use feedback to improve myself.' },
  { id: 53, section: 'Behavioural',      dimension: 'public_speaking',          text: 'I feel confident presenting or speaking in front of groups.' },
  { id: 54, section: 'Behavioural',      dimension: 'grit',                     text: 'I tend to keep trying a difficult problem even after multiple failures, rather than moving on.' },
  { id: 55, section: 'Behavioural',      dimension: 'intrinsic_curiosity',      text: 'I often research a topic extensively on my own, beyond what was required in class.' },
  { id: 56, section: 'Open-Ended',       dimension: 'dream_career',             text: 'What is your dream career, and why does it inspire you?' },
  { id: 57, section: 'Open-Ended',       dimension: 'challenge_overcome',       text: 'Describe a challenge you faced and how you overcame it.' },
  { id: 58, section: 'Open-Ended',       dimension: 'role_model',               text: 'Name one person — real or fictional — whose career or life you admire most, and explain what specifically about their path appeals to you.' },
  { id: 59, section: 'Open-Ended',       dimension: 'intrinsic_motivation',     text: 'If money was not a concern, what would you spend most of your time doing? How close is that to what you are currently pursuing?' },
  { id: 60, section: 'Open-Ended',       dimension: 'india_vs_abroad',          text: 'Would you prefer building your career in India, abroad, or both? Why?' },
]

const SCALE_LABELS = {
  Personality:        ['', 'Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
  Aptitude:           ['', 'Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
  Behavioural:        ['', 'Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
  'Career Interests': ['', 'Very Interested', 'Interested', 'Neutral', 'Not Interested'],
  Motivation:         ['', 'Very Important', 'Important', 'Neutral', 'Not Important'],
  'Open-Ended':       null,
}

// ─────────────────────────────────────────────
// SCORING
// ─────────────────────────────────────────────
function computeSectionScores(rawAnswers) {
  const sectionData = {}
  QUESTION_BANK.forEach((q, idx) => {
    const raw = parseInt(rawAnswers[idx], 10)
    if (isNaN(raw) || q.section === 'Open-Ended') return
    if (!sectionData[q.section]) sectionData[q.section] = []
    const scale = (q.section === 'Career Interests' || q.section === 'Motivation') ? 4 : 5
    const value = q.reverse ? raw : (scale + 1 - raw)
    sectionData[q.section].push({ value, max: scale })
  })
  const scores = {}
  for (const [section, items] of Object.entries(sectionData)) {
    const total = items.reduce((s, i) => s + i.value, 0)
    const maxTotal = items.reduce((s, i) => s + i.max, 0)
    scores[section] = Math.round((total / maxTotal) * 100)
  }
  return scores
}

function extractKeySignals(rawAnswers) {
  const signals = {}
  QUESTION_BANK.forEach((q, idx) => {
    const raw = parseInt(rawAnswers[idx], 10)
    const labels = SCALE_LABELS[q.section]
    signals[q.dimension] = {
      raw,
      label: labels ? (labels[raw] || raw) : rawAnswers[idx],
    }
  })
  return signals
}

function buildAssessmentContext(assessment) {
  if (!assessment?.raw_answers) return 'No answers provided.'
  const answers = assessment.raw_answers
  const sectionScores = computeSectionScores(answers)
  const signals = extractKeySignals(answers)
  const lines = []

  lines.push('=== COMPUTED SECTION SCORES (0-100, higher = stronger) ===')
  for (const [section, score] of Object.entries(sectionScores)) {
    lines.push(`${section}: ${score}/100`)
  }

  lines.push('\n=== KEY DIAGNOSTIC SIGNALS ===')
  lines.push(`Decisiveness (Q11): ${signals.decisiveness?.label} — ${signals.decisiveness?.raw <= 2 ? 'Acts fast, corrects later. Entrepreneur-compatible.' : 'Prefers certainty before acting.'}`)
  lines.push(`Risk Tolerance (Q45): ${signals.risk_tolerance?.label} — ${signals.risk_tolerance?.raw <= 2 ? 'HIGH — startup/founder path viable.' : 'LOW — stable corporate or government path preferred.'}`)
  lines.push(`Procrastination (Q48): ${signals.procrastination?.label} — ${signals.procrastination?.raw <= 2 ? 'SEVERE RISK: deadline-only worker. Unsuitable for self-structured roles.' : 'Proactive worker.'}`)
  lines.push(`Specialist vs Generalist (Q47): ${signals.specialist_vs_generalist?.label} — ${signals.specialist_vs_generalist?.raw <= 2 ? 'Deep specialist. Recommend niche/expert roles only.' : 'Generalist. Cross-functional roles viable.'}`)
  lines.push(`Family Approval (Q46): ${signals.family_approval?.label} — ${signals.family_approval?.raw <= 2 ? 'Family approval critical. Recommend careers legible to Indian families.' : 'Career autonomy. Can explore unconventional paths.'}`)
  lines.push(`Global Ambition — Travel (Q44): ${signals.global_exposure?.label}, Abroad Study (Q27): ${signals.abroad_study?.label}`)

  lines.push('\n=== FULL LABELLED ANSWERS ===')
  QUESTION_BANK.forEach((q, idx) => {
    const rawVal = answers[idx]
    const labels = SCALE_LABELS[q.section]
    const displayVal = labels ? (labels[parseInt(rawVal)] || rawVal) : rawVal
    lines.push(`Q${q.id} [${q.section} / ${q.dimension}]: "${q.text}" → ${displayVal}`)
  })

  lines.push('\n=== OPEN-ENDED ANSWERS (quote these directly in the report) ===')
  QUESTION_BANK.filter(q => q.section === 'Open-Ended').forEach((q, idx) => {
    lines.push(`Q${q.id} — ${q.dimension}:\n"${answers[55 + idx] || 'No answer provided'}"`)
  })

  return lines.join('\n')
}

// ─────────────────────────────────────────────
// SYSTEM PROMPT
// ─────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a warm, deeply insightful career mentor writing directly to a real Indian college student who is confused about their future and needs clarity, courage, and a concrete plan.

TONE (this changes everything):
- Write using "you" and "your" throughout. Never say "the subject" or "the candidate".
- Use plain, warm English. Write like a trusted elder sibling who happens to be a career expert.
- Be honest but kind. If there is a risk, name it with care — not as a verdict, but as a heads-up from someone who genuinely wants them to succeed.
- Short sentences. Active voice. Every paragraph must feel like it was written for this one specific person.

CONTENT RULES (non-negotiable):
1. ZERO GENERIC PHRASES: Never use "highly motivated", "thrives in dynamic environments", "natural leader", "passionate learner". Every sentence must apply only to this student — it must be falsifiable.
2. CITE DATA EVERY SENTENCE in executive_summary: Reference a specific question number and score in every sentence. No floating claims.
3. MANDATORY: Explicitly mention Q45 (risk tolerance), Q11 (decisiveness), and Q58 (role model) at least once each in the executive summary.
4. PROCRASTINATION: If Q48 is Strongly Agree or Agree — flag it first in what_to_avoid as a self-management risk. Name the real consequence in a work setting.
5. SPECIALIST FLAG: If Q47 is Very Important or Important — only recommend deep-specialist roles. Never recommend "General Manager" or "Business Development".
6. ROLE MODEL MIRROR: Year 5 roadmap milestone must explicitly connect to Q58 role model. If they admire a founder — Year 5 = launching something. If a scientist — Year 5 = publishing or leading research.
7. INDIA VS ABROAD: If Q60 mentions abroad — include at least one international milestone in the roadmap.
8. SECTOR MATCH: Career matches must come from the student's highest-scoring interest dimensions. Never default to generic tech and consulting for everyone.
9. IDENTITY STATEMENT: One sentence. Must make the student feel deeply seen — like someone finally understood who they really are. Grounded in their actual data. Specific, not generic.
10. STRENGTH SIGNALS: Based on their actual high-scoring dimensions. Evidence must cite a specific question.
11. WHAT TO AVOID: Must be specific to their data. Name real role types, environments, or habits — not generic advice.

OUTPUT: Respond ONLY with valid JSON matching the schema exactly.`

// ─────────────────────────────────────────────
// OUTPUT SCHEMA
// ─────────────────────────────────────────────
const OUTPUT_SCHEMA = `{
  "user_archetype": "2-3 word label derived from their top scoring dimensions. Clinical but human. E.g. 'Pragmatic Social Founder', 'Analytical Deep Specialist'.",

  "identity_statement": "THE most important field. One powerful, emotionally resonant sentence that captures who this student is at their core — grounded in their actual Q scores and open-ended answers. Not a label. A mirror. Must feel like only they could have received this sentence. Example: 'You are someone who needs to build things that matter, and you will be quietly miserable in any role that asks you to maintain what someone else already created.'",

  "executive_summary": {
    "paragraph_1": "Their core cognitive and behavioural wiring. Written directly to them using 'you'. Every sentence cites a Q number and score. Short sentences. Warm but precise. 4-5 sentences.",
    "paragraph_2": "Their risk profile and decisiveness pattern — what kind of environment they will thrive or struggle in. Must explicitly cite Q45 (risk tolerance) and Q11 (decisiveness) by name. 3-4 sentences.",
    "paragraph_3": "Connect their role model (Q58) to their intrinsic motivation (Q59) and show the gap — or the alignment — with where they currently are. Quote their open-ended answers directly. 3-4 sentences."
  },

  "radar_chart_scores": {
    "Personality": 0,
    "Aptitude": 0,
    "Motivation": 0,
    "Career Interests": 0,
    "Behavioural Tendencies": 0
  },

  "strength_signals": [
    {
      "label": "3-4 word strength label",
      "evidence": "One sentence citing the exact Q score that proves this strength. Direct and specific.",
      "icon_hint": "one of: brain | target | users | trending-up | lightbulb | globe | shield | zap"
    }
  ],

  "top_career_matches": [
    {
      "career_title": "Specific Job Title — not a broad category",
      "compatibility_score": 90,
      "match_reason": "2-3 sentences written directly to the student. Must cite specific Q scores. Explain exactly why this role fits their wiring.",
      "growth_path": "Entry Level Role → Mid Level Role → Senior Role",
      "starting_salary_inr": "₹X LPA - ₹Y LPA",
      "key_certifications": ["Specific Cert Name", "Specific Cert Name"]
    }
  ],

  "psychometric_profile": {
    "dominant_personality_traits": ["Trait with Q score evidence", "Trait with Q score evidence", "Trait with Q score evidence"],
    "learning_style": "How this specific student learns best — derived from Section 3 aptitude scores. Written to them directly.",
    "work_environment_fit": "The specific type of environment where they will do their best work. Cite behavioural scores.",
    "collaboration_style": "How they actually work with others. Based on Q3, Q50, Q51 scores. Honest and specific."
  },

  "what_to_avoid": [
    {
      "category": "Role Type OR Work Environment OR Career Habit",
      "warning": "The specific thing to avoid — name it clearly.",
      "reason": "Exactly why — citing the specific score that makes this a bad fit for them."
    }
  ],

  "potential_blind_spots": [
    "If Q48 Strongly Agree or Agree: 'SEVERE OPERATIONAL RISK — [name the real consequence in a work scenario]'",
    "Other specific risk with Q score evidence."
  ],

  "immediate_action_plan": {
    "next_30_days": "One concrete, specific action. Specific enough that they know exactly what to do this Monday morning.",
    "next_90_days": "One skill or credential to pursue. Name the specific course, exam, or platform if possible.",
    "success_metric": "Exactly how they will know they completed it — measurable."
  },

  "five_year_roadmap": {
    "year_1": "Foundation — what to learn, which certifications or exams to target, what type of first role to aim for. Written directly to them.",
    "year_2": "Skill Application — first real role type and what to focus on building. Include an abroad milestone here if Q60 mentions it.",
    "year_3": "Market Acceleration — the mid-level target role, realistic salary expectation, and what will differentiate them.",
    "year_4": "Strategic Positioning — advanced credentials, network moves, or groundwork for entrepreneurship if that is their path.",
    "year_5": "Mastery — a specific leadership or impact milestone explicitly modelled on their Q58 role model. Should feel like a destiny, not just a job title."
  },

  "india_vs_abroad_guidance": "Specific routing advice based on their exact Q60 answer and Q27 score. If India — name specific cities and ecosystems. If abroad — name specific countries or programs to target."
}`

// ─────────────────────────────────────────────
// GEMINI CALL
// ─────────────────────────────────────────────
async function generateRoadmap({ student_profile, assessment_context }) {
  if (!process.env.GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY')

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.3,
    },
  })

  const userPrompt = `
STUDENT PROFILE:
Name: ${student_profile.name}
College: ${student_profile.college}

${assessment_context}

Generate the complete career roadmap. Return ONLY valid JSON matching this schema exactly:
${OUTPUT_SCHEMA}

FINAL CHECKLIST — verify before writing:
- Did you write "you/your" throughout? Not "the subject"?
- Did you cite Q11 (decisiveness) in the executive summary?
- Did you cite Q45 (risk tolerance) in the executive summary?
- Did you quote Q58 (role model) directly in paragraph 3?
- Is the identity_statement truly unique to this student — could it apply to anyone else?
- If Q48 <= 2 (procrastination risk) — is it the first item in what_to_avoid?
- Does Year 5 roadmap explicitly connect to their Q58 role model's path?
- Does india_vs_abroad_guidance reflect Q60's exact words?
- Are strength_signals based on actual high-scoring dimensions — not generic?
`

  const result = await model.generateContent(userPrompt)
  return JSON.parse(result.response.text())
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const jsonResponse = (data, status = 200) => NextResponse.json(data, { status })

const normalizeAssessment = (assessment) => {
  if (!assessment) return null
  return { ...assessment, ai_analysis: assessment.ai_analysis_result || assessment.ai_analysis }
}

// ─────────────────────────────────────────────
// POST HANDLER
// ─────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json()
    const { assessmentId } = body

    if (!assessmentId) return jsonResponse({ error: 'assessmentId is required' }, 400)

    const supabase = getSupabaseAdmin()
    const { data: assessment, error: fetchError } = await supabase
      .from('assessments')
      .select('*, users(*)')
      .eq('id', assessmentId)
      .single()

    if (fetchError || !assessment) return jsonResponse({ error: 'Assessment not found' }, 404)

    // Return cached report if it exists
    if (assessment.ai_analysis_result?.user_archetype) {
      return jsonResponse({ ok: true, assessment: normalizeAssessment(assessment) })
    }

    const aiAnalysis = await generateRoadmap({
      student_profile: {
        name: assessment?.users?.name || 'Student',
        college: assessment?.users?.college || '',
      },
      assessment_context: buildAssessmentContext(assessment),
    })

    const { data: updated, error: updateError } = await supabase
      .from('assessments')
      .update({ ai_analysis_result: aiAnalysis })
      .eq('id', assessmentId)
      .select('*, users(*)')
      .single()

    if (updateError) {
      console.error('Supabase update error:', updateError)
      return jsonResponse({ error: 'Failed to save report' }, 500)
    }

    return jsonResponse({ ok: true, assessment: normalizeAssessment(updated) })

  } catch (error) {
    console.error('Roadmap generation failed:', error)
    return jsonResponse({ error: error?.message || 'AI Generation Failed' }, 500)
  }
}
