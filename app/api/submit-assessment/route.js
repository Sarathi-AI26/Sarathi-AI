// app/api/submit-assessment/route.js
import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../lib/supabase'

export const runtime = 'nodejs'
// 🚀 Tells Vercel this is a fast route (only saving data, not waiting for AI)
export const maxDuration = 30  

const EXPECTED_ANSWER_COUNT = 60

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, college, answers } = body

    // ── 1. Input validation ──────────────────────────────────────────
    if (!name || !email || !college) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, college' },
        { status: 400 }
      )
    }

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Answers must be an array' },
        { status: 400 }
      )
    }

    if (answers.length !== EXPECTED_ANSWER_COUNT) {
      return NextResponse.json(
        {
          error: `Expected ${EXPECTED_ANSWER_COUNT} answers, received ${answers.length}. Assessment incomplete.`,
        },
        { status: 400 }
      )
    }

    const hasEmptyAnswers = answers.some(
      (a) => a === null || a === undefined || a === ''
    )
    if (hasEmptyAnswers) {
      return NextResponse.json(
        { error: 'All 60 questions must be answered before submitting.' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()

    // ── 2. Upsert user ───────────────────────────────────────────────
    let userId = null

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      userId = existingUser.id

      const { error: updateError } = await supabase
        .from('users')
        .update({ name, college })
        .eq('id', userId)

      if (updateError) {
        console.error('Failed to update user details:', updateError)
      }
    } else {
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert([{ name, email, college }])
        .select('id')
        .single()

      if (userError) {
        return NextResponse.json(
          { error: 'Failed to create user', details: userError.message },
          { status: 500 }
        )
      }
      userId = newUser.id
    }

    // ── 3. Duplicate assessment guard ────────────────────────────────
    const { data: existingAssessment } = await supabase
      .from('assessments')
      .select('id, ai_analysis_result')
      .eq('user_id', userId)
      .eq('payment_status', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (existingAssessment) {
      // 🚀 Re-submitting: update answers, clear old AI result, set to pending
      const { error: updateError } = await supabase
        .from('assessments')
        .update({
          raw_answers: answers,
          ai_analysis_result: null, 
          generation_status: 'pending', // Tell poller it needs to run again
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingAssessment.id)

      if (updateError) {
        console.error('Failed to update existing assessment:', updateError)
        return NextResponse.json(
          { error: 'Failed to update assessment', details: updateError.message },
          { status: 500 }
        )
      }

      // 🚀 Fire and forget background generation
      triggerBackgroundGeneration(existingAssessment.id)

      return NextResponse.json({ assessmentId: existingAssessment.id })
    }

    // ── 4. Create new assessment ─────────────────────────────────────
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .insert([
        {
          user_id: userId,
          raw_answers: answers,
          payment_status: false, // 🚀 Fixed: Requires Razorpay or B2B Campus Seat to unlock
          generation_status: 'pending' // Tell poller AI is about to start
        },
      ])
      .select('id')
      .single()

    if (assessmentError) {
      return NextResponse.json(
        { error: 'Failed to save assessment', details: assessmentError.message },
        { status: 500 }
      )
    }

    // 🚀 Fire and forget background generation
    triggerBackgroundGeneration(assessment.id)

    // Return instantly so the frontend routes them to checkout/dashboard
    return NextResponse.json({ assessmentId: assessment.id })

  } catch (error) {
    console.error('Submit Assessment Error:', error)
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    )
  }
}

// ── 5. Background Trigger (Fire & Forget) ─────────────────────────
// This function calls the Gemini API without making the user wait for it.
async function triggerBackgroundGeneration(assessmentId) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sarathiapp.in'
    
    // We intentionally DO NOT 'await' this fetch. It runs entirely in the background.
    fetch(`${baseUrl}/api/generate-roadmap`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ assessmentId }),
    }).catch(err => console.warn("Background fetch warning (normal if unawaited):", err.message))
    
  } catch (err) {
    console.warn(`Background generation trigger failed for ${assessmentId}:`, err.message)
  }
}
