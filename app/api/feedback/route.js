import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../lib/supabase'

export async function POST(request) {
  try {
    const { assessmentId, careerTitle, rating } = await request.json()

    if (!assessmentId || !careerTitle || !['up', 'down'].includes(rating)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    await supabase.from('career_feedback').insert([{
      assessment_id: assessmentId,
      career_title: careerTitle,
      rating,
      created_at: new Date().toISOString(),
    }])

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
