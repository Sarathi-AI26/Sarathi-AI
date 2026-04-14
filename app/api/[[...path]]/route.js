import { NextResponse } from 'next/server'

import { getSupabaseAdmin } from '../../../lib/supabase'
import { assessmentQuestions, buildCareerAnalysis } from '../../../lib/sarathi-data'

const jsonResponse = (payload, status = 200) => {
  const response = NextResponse.json(payload, { status })
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

const withSchemaHint = (error, fallbackMessage = 'Unexpected Supabase error') => {
  const message = error?.message || fallbackMessage
  const schemaMissing =
    message.includes('Could not find the table') ||
    message.includes('relation') ||
    message.includes('column') ||
    error?.code === '42P01'

  return {
    error: schemaMissing
      ? 'Supabase schema is missing. Please run /app/supabase_schema.sql in the Supabase SQL Editor, then retry.'
      : fallbackMessage,
    details: message,
  }
}

const assessmentWithUserSelect = '*, users(id, email, name, college, created_at)'

const normalizeAssessment = (row) => {
  const user = row?.users || row?.user || null
  const answers = row?.answers_json || row?.raw_answers || {}
  const storedAnalysis = row?.ai_analysis || row?.ai_analysis_result

  return {
    id: row?.id,
    user_id: row?.user_id,
    payment_status: row?.payment_status,
    created_at: row?.created_at,
    answers_json: answers,
    ai_analysis: storedAnalysis || buildCareerAnalysis(answers, user?.name || 'Student'),
    user,
  }
}

const getRoute = (params) => {
  const rawPath = params?.path || []
  const pathArray = Array.isArray(rawPath) ? rawPath : [rawPath]
  const route = `/${pathArray.filter(Boolean).join('/')}`
  return route === '/' ? '/' : route.replace(/\/+$/, '')
}

const validateAnswers = (answers) => {
  const validIds = new Set(assessmentQuestions.map((question) => question.id))
  const validOptions = new Set(['a', 'b', 'c', 'd'])

  if (!answers || typeof answers !== 'object') {
    return false
  }

  return assessmentQuestions.every((question) => {
    const value = answers[question.id]
    return validIds.has(question.id) && validOptions.has(value)
  })
}

const createAssessmentRecord = async (supabase, userId, answers) => {
  let result = await supabase
    .from('assessments')
    .insert({
      user_id: userId,
      raw_answers: answers,
      payment_status: false,
    })
    .select('*')
    .single()

  const fallbackNeeded = result?.error?.message?.includes('raw_answers')

  if (fallbackNeeded) {
    result = await supabase
      .from('assessments')
      .insert({
        user_id: userId,
        answers_json: answers,
        payment_status: false,
      })
      .select('*')
      .single()
  }

  return result
}

export async function OPTIONS() {
  return jsonResponse({ ok: true })
}

const handleRoute = async (request, { params }) => {
  const method = request.method
  const route = getRoute(params)

  try {
    const supabase = getSupabaseAdmin()

    if ((route === '/' || route === '/root') && method === 'GET') {
      return jsonResponse({
        ok: true,
        app: 'SARATHI API',
        message: 'Career guidance API is live',
        routes: ['/api/assessment/questions', '/api/assessments', '/api/payments/mock', '/api/results/:id'],
      })
    }

    if (route === '/assessment/questions' && method === 'GET') {
      return jsonResponse({ questions: assessmentQuestions })
    }

    if (route === '/schema' && method === 'GET') {
      return jsonResponse({
        ok: true,
        sql_file: '/app/supabase_schema.sql',
        note: 'Run this script in Supabase SQL Editor before testing assessment creation.',
      })
    }

    if (route === '/assessments' && method === 'POST') {
      const body = await request.json()
      const name = body?.name?.trim()
      const email = body?.email?.trim()?.toLowerCase()
      const college = body?.college?.trim()
      const answers = body?.answers_json || {}

      if (!name || !email || !college) {
        return jsonResponse({ error: 'name, email, and college are required' }, 400)
      }

      if (!validateAnswers(answers)) {
        return jsonResponse({ error: 'All 5 assessment questions must be answered' }, 400)
      }

      const { data: user, error: userError } = await supabase
        .from('users')
        .upsert({ name, email, college }, { onConflict: 'email' })
        .select('id, email, name, college, created_at')
        .single()

      if (userError) {
        return jsonResponse(withSchemaHint(userError, 'Unable to save student profile'), 500)
      }

      const { data: assessment, error: assessmentError } = await createAssessmentRecord(
        supabase,
        user.id,
        answers
      )

      if (assessmentError) {
        return jsonResponse(withSchemaHint(assessmentError, 'Unable to create assessment'), 500)
      }

      return jsonResponse({
        ok: true,
        assessment: normalizeAssessment({
          ...assessment,
          users: user,
        }),
        next_step: `/checkout?assessmentId=${assessment.id}`,
      }, 201)
    }

    if (route.startsWith('/assessments/') && method === 'GET') {
      const assessmentId = route.split('/')[2]

      const { data, error } = await supabase
        .from('assessments')
        .select(assessmentWithUserSelect)
        .eq('id', assessmentId)
        .single()

      if (error) {
        const status = error.code === 'PGRST116' ? 404 : 500
        return jsonResponse(withSchemaHint(error, 'Assessment not found'), status)
      }

      return jsonResponse({ ok: true, assessment: normalizeAssessment(data) })
    }

    if (route === '/payments/mock' && method === 'POST') {
      const body = await request.json()
      const assessmentId = body?.assessmentId

      if (!assessmentId) {
        return jsonResponse({ error: 'assessmentId is required' }, 400)
      }

      const { data, error } = await supabase
        .from('assessments')
        .update({ payment_status: true })
        .eq('id', assessmentId)
        .select('*')
        .single()

      if (error) {
        const status = error.code === 'PGRST116' ? 404 : 500
        return jsonResponse(withSchemaHint(error, 'Unable to confirm mock payment'), status)
      }

      return jsonResponse({
        ok: true,
        payment: {
          status: 'MOCKED_SUCCESS',
          amount_inr: 99,
          assessment_id: data.id,
        },
        assessment: data,
        next_step: `/result?id=${data.id}`,
      })
    }

    if (route.startsWith('/results/') && method === 'GET') {
      const assessmentId = route.split('/')[2]

      const { data, error } = await supabase
        .from('assessments')
        .select(assessmentWithUserSelect)
        .eq('id', assessmentId)
        .single()

      if (error) {
        const status = error.code === 'PGRST116' ? 404 : 500
        return jsonResponse(withSchemaHint(error, 'Unable to fetch result dashboard'), status)
      }

      if (!data.payment_status) {
        return jsonResponse(
          {
            error: 'Payment required before viewing result dashboard',
            next_step: `/checkout?assessmentId=${assessmentId}`,
          },
          402
        )
      }

      return jsonResponse({ ok: true, assessment: normalizeAssessment(data) })
    }

    return jsonResponse({ error: `Route ${route} not found` }, 404)
  } catch (error) {
    console.error('SARATHI API error:', error)
    return jsonResponse({
      error: 'Internal server error',
      details: error?.message || 'Unknown error',
    }, 500)
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const PATCH = handleRoute
export const DELETE = handleRoute
