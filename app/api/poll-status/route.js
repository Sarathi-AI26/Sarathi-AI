// app/api/poll-status/route.js
import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../lib/supabase'

export const runtime = 'nodejs'
export const maxDuration = 10
export const dynamic = 'force-dynamic'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const assessmentId = searchParams.get('assessmentId')

  if (!assessmentId) {
    return NextResponse.json({ error: 'assessmentId required' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('assessments')
    .select(`
      id,
      payment_status,
      generation_status,
      ai_analysis_result,
      users(name, email, college)
    `)
    .eq('id', assessmentId)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
  }

  const isReady = Boolean(data.ai_analysis_result?.user_archetype)

  return NextResponse.json({
    assessmentId,
    isReady,
    paymentStatus:    data.payment_status,
    generationStatus: data.generation_status || 'pending',
    // Only include full data when ready — keeps polling responses tiny
    assessment: isReady ? data : null,
  })
}
