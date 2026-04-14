import path from 'path'
import { spawn } from 'child_process'
import { NextResponse } from 'next/server'

import { getSupabaseAdmin } from '../../../lib/supabase'
import { assessmentQuestions } from '../../../lib/psychometric-assessment'

const assessmentSelect = '*, users(id, email, name, college, created_at)'

const jsonResponse = (payload, status = 200) => {
  const response = NextResponse.json(payload, { status })
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

const hasRealAiAnalysis = (analysis) => {
  return Boolean(
    analysis?.user_archetype &&
      typeof analysis?.executive_summary === 'string' &&
      Array.isArray(analysis?.top_career_matches)
  )
}

const normalizeAssessment = (row) => {
  const user = row?.users || row?.user || null
  const answers = row?.raw_answers || row?.answers_json || {}
  const aiAnalysis = row?.ai_analysis_result || row?.ai_analysis || null

  return {
    id: row?.id,
    user_id: row?.user_id,
    payment_status: row?.payment_status,
    created_at: row?.created_at,
    answers_json: answers,
    ai_analysis: aiAnalysis,
    user,
  }
}

const buildAssessmentContext = (row) => {
  const answers = row?.raw_answers || row?.answers_json || {}

  return assessmentQuestions.map((question) => {
    const selectedValue = answers?.[question.id] || null
    const selectedOption = question.options?.find((option) => option.value === selectedValue)

    return {
      question_id: question.id,
      question_number: question.question_number,
      section: question.section_title,
      question: question.question,
      question_description: question.section_description,
      response_type: question.input_type,
      selected_option_value: question.input_type === 'choice' ? selectedValue : null,
      selected_option_label: question.input_type === 'choice' ? selectedOption?.label || null : null,
      response_text: question.input_type === 'text' ? selectedValue : null,
      all_options: (question.options || []).map((option) => ({
        value: option.value,
        label: option.label,
      })),
    }
  })
}

const toStringValue = (value, fallback = '') => {
  if (typeof value === 'string') {
    return value.trim() || fallback
  }

  if (value === null || value === undefined) {
    return fallback
  }

  return String(value)
}

const toStringArray = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => toStringValue(item)).filter(Boolean)
  }

  const singleValue = toStringValue(value)
  return singleValue ? [singleValue] : []
}

const normalizeAiPayload = (analysis) => {
  if (!analysis || typeof analysis !== 'object') {
    return null
  }

  const profile = analysis?.psychometric_profile || {}
  const roadmap = analysis?.one_year_roadmap || analysis?.roadmap || {}
  const rawCareerMatches = Array.isArray(analysis?.top_career_matches)
    ? analysis.top_career_matches
    : analysis?.top_career_matches
      ? [analysis.top_career_matches]
      : []

  const normalizedCareerMatches = rawCareerMatches
    .map((item) => ({
      career_title: toStringValue(item?.career_title || item?.title),
      why_it_fits: toStringValue(item?.why_it_fits || item?.why),
      starting_salary_inr: toStringValue(item?.starting_salary_inr || item?.salary_range),
      growth_potential: toStringValue(item?.growth_potential),
    }))
    .filter((item) => item.career_title && item.why_it_fits)

  const normalized = {
    user_archetype: toStringValue(analysis?.user_archetype),
    executive_summary: toStringValue(analysis?.executive_summary || analysis?.summary),
    psychometric_profile: {
      dominant_personality_traits: toStringArray(profile?.dominant_personality_traits),
      core_motivators: toStringArray(profile?.core_motivators),
      learning_style: toStringValue(profile?.learning_style),
    },
    top_career_matches: normalizedCareerMatches,
    one_year_roadmap: {
      q1_focus: toStringValue(roadmap?.q1_focus || roadmap?.q1),
      q2_focus: toStringValue(roadmap?.q2_focus || roadmap?.q2),
      q3_focus: toStringValue(roadmap?.q3_focus || roadmap?.q3),
      q4_focus: toStringValue(roadmap?.q4_focus || roadmap?.q4),
    },
    potential_blind_spots: toStringArray(analysis?.potential_blind_spots),
  }

  return normalized
}

const validateAiPayload = (analysis) => {
  if (!analysis || typeof analysis !== 'object') {
    return false
  }

  return Boolean(
    analysis.user_archetype &&
      analysis.executive_summary &&
      analysis.psychometric_profile?.learning_style &&
      analysis.top_career_matches?.length &&
      analysis.one_year_roadmap?.q1_focus &&
      analysis.one_year_roadmap?.q2_focus &&
      analysis.one_year_roadmap?.q3_focus &&
      analysis.one_year_roadmap?.q4_focus &&
      analysis.potential_blind_spots?.length
  )
}

const generateValidatedRoadmap = async (payload) => {
  let lastResponse = null

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const rawResponse = await runGeneratorScript(payload)
    const normalizedResponse = normalizeAiPayload(rawResponse)
    lastResponse = normalizedResponse || rawResponse

    if (validateAiPayload(normalizedResponse)) {
      return normalizedResponse
    }
  }

  throw new Error(`AI returned an unexpected JSON structure: ${JSON.stringify(lastResponse)}`)
}

const runGeneratorScript = (payload) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), 'scripts', 'generate_roadmap.py')
    const child = spawn('/root/.venv/bin/python3', [scriptPath], {
      cwd: process.cwd(),
      env: process.env,
    })

    let stdout = ''
    let stderr = ''

    const timeout = setTimeout(() => {
      child.kill('SIGKILL')
      reject(new Error('AI roadmap generation timed out'))
    }, 180000)

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString()
    })

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString()
    })

    child.on('error', (error) => {
      clearTimeout(timeout)
      reject(error)
    })

    child.on('close', (code) => {
      clearTimeout(timeout)

      if (code !== 0) {
        reject(new Error(stderr || `Generator exited with code ${code}`))
        return
      }

      try {
        resolve(JSON.parse(stdout))
      } catch (error) {
        reject(new Error(`Invalid AI JSON output: ${stdout || error.message}`))
      }
    })

    child.stdin.write(JSON.stringify(payload))
    child.stdin.end()
  })
}

const updateAnalysisRecord = async (supabase, assessmentId, aiAnalysis) => {
  let result = await supabase
    .from('assessments')
    .update({ ai_analysis_result: aiAnalysis })
    .eq('id', assessmentId)
    .select(assessmentSelect)
    .single()

  if (result?.error?.message?.includes('ai_analysis_result')) {
    result = await supabase
      .from('assessments')
      .update({ ai_analysis: aiAnalysis })
      .eq('id', assessmentId)
      .select(assessmentSelect)
      .single()
  }

  return result
}

export async function OPTIONS() {
  return jsonResponse({ ok: true })
}

export async function POST(request) {
  try {
    const body = await request.json()
    const assessmentId = body?.assessmentId
    const force = Boolean(body?.force)

    if (!assessmentId) {
      return jsonResponse({ error: 'assessmentId is required' }, 400)
    }

    if (!process.env.EMERGENT_LLM_KEY) {
      return jsonResponse({ error: 'Missing EMERGENT_LLM_KEY' }, 500)
    }

    const supabase = getSupabaseAdmin()
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select(assessmentSelect)
      .eq('id', assessmentId)
      .single()

    if (assessmentError) {
      const status = assessmentError?.code === 'PGRST116' ? 404 : 500
      return jsonResponse({ error: 'Unable to load assessment for AI analysis', details: assessmentError.message }, status)
    }

    if (!assessment?.payment_status) {
      return jsonResponse({ error: 'Payment required before generating the roadmap' }, 402)
    }

    const normalized = normalizeAssessment(assessment)
    const existingAnalysis = normalized?.ai_analysis

    if (!force && hasRealAiAnalysis(existingAnalysis)) {
      return jsonResponse({ ok: true, assessment: normalized, cached: true })
    }

    if (!normalized?.answers_json || Object.keys(normalized.answers_json).length === 0) {
      return jsonResponse({ error: 'No assessment answers found for this record' }, 400)
    }

    const aiAnalysis = await generateValidatedRoadmap({
      session_id: `sarathi-roadmap-${assessment.id}`,
      assessment_id: assessment.id,
      student_profile: {
        name: normalized?.user?.name || 'Student',
        email: normalized?.user?.email || '',
        college: normalized?.user?.college || '',
      },
      assessment_context: buildAssessmentContext(assessment),
    })

    const { data: updatedAssessment, error: updateError } = await updateAnalysisRecord(
      supabase,
      assessmentId,
      aiAnalysis
    )

    if (updateError) {
      return jsonResponse({ error: 'Unable to save AI roadmap', details: updateError.message }, 500)
    }

    return jsonResponse({
      ok: true,
      assessment: normalizeAssessment(updatedAssessment),
      cached: false,
    })
  } catch (error) {
    console.error('Generate roadmap API error:', error)
    return jsonResponse({ error: 'Unable to generate AI roadmap', details: error?.message || 'Unknown error' }, 500)
  }
}
