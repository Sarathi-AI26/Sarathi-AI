import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../lib/supabase'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, whatsapp, college, answers } = body
    const supabase = getSupabaseAdmin()

    // 1. Check if user already exists
    const fakeEmail = `${whatsapp}@temp-sarathi.com`
    let userId = null;

    const { data: existingUser } = await supabase.from('users').select('id').eq('email', fakeEmail).single()
    
    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create new user
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert([{ name: name, college: college, email: fakeEmail }])
        .select('id')
        .single()

      if (userError) {
        return NextResponse.json({ error: 'User Table Error', details: userError }, { status: 500 })
      }
      userId = user.id
    }

   // 2. Save Assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .insert([{
        user_id: userId,
        raw_answers: answers, // 🚀 Changed this column name!
        payment_status: true
      }])
      .select('id')
      .single()

    if (assessmentError) {
      return NextResponse.json({ error: 'Assessment Table Error', details: assessmentError }, { status: 500 })
    }

    return NextResponse.json({ assessmentId: assessment.id })

  } catch (error) {
    console.error('Submit Assessment Error:', error)
    return NextResponse.json({ error: 'Total Server Failure', details: error.message }, { status: 500 })
  }
}
