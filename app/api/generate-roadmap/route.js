import path from 'path'
import { spawn } from 'child_process'
import { NextResponse } from 'next/server'

import { getSupabaseAdmin } from '../../../lib/supabase'
import { assessmentQuestions } from '../../../lib/sarathi-data'

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
    const selectedOption = question.options.find((option) => option.value === selectedValue)

    return {
      question_id: question.id,
      question: question.question,
      question_description: question.description,
      selected_option_value: selectedValue,
      selected_option_label: selectedOption?.label || null,
      all_options: question.options.map((option) => ({
        value: option.value,
        label: option.label,
      })),
    }
  })
}

const validateAiPayload = (analysis) => {
  if (!analysis || typeof analysis !== 'object') {
    return false
  }

  return (
    typeof analysis.user_archetype === 'string' &&
    typeof analysis.executive_summary === 'string' &&
    typeof analysis.psychometric_profile?.learning_style === 'string' &&
    Array.isArray(analysis.psychometric_profile?.dominant_personality_traits) &&
    Array.isArray(analysis.psychometric_profile?.core_motivators) &&
    Array.isArray(analysis.top_career_matches) &&
    typeof analysis.one_year_roadmap?.q1_focus === 'string' &&
    typeof analysis.one_year_roadmap?.q2_focus === 'string' &&
    typeof analysis.one_year_roadmap?.q3_focus === 'string' &&
    typeof analysis.one_year_roadmap?.q4_focus === 'string' &&
    Array.isArray(analysis.potential_blind_spots)
  )
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

    const aiAnalysis = await runGeneratorScript({
      session_id: `sarathi-roadmap-${assessment.id}`,
      assessment_id: assessment.id,
      student_profile: {
        name: normalized?.user?.name || 'Student',
        email: normalized?.user?.email || '',
        college: normalized?.user?.college || '',
      },
      assessment_context: buildAssessmentContext(assessment),
    })

    if (!validateAiPayload(aiAnalysis)) {
      return jsonResponse({ error: 'AI returned an unexpected JSON structure', details: aiAnalysis }, 502)
    }

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
