import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../lib/supabase'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, whatsapp, college, answers } = body // Accept email & whatsapp
    const supabase = getSupabaseAdmin()

    // 1. Check if user already exists by Email
    let userId = null;
    const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).single()
    
    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create new user with real data
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert([{ 
          name: name, 
          email: email, 
          whatsapp: whatsapp, // Saving real WhatsApp number
          college: college 
        }])
        .select('id')
        .single()

      if (userError) return NextResponse.json({ error: 'User Table Error', details: userError }, { status: 500 })
      userId = user.id
    }

    // 2. Save Assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .insert([{
        user_id: userId,
        raw_answers: answers, 
        payment_status: true
      }])
      .select('id')
      .single()

    if (assessmentError) return NextResponse.json({ error: 'Assessment Error', details: assessmentError }, { status: 500 })

    return NextResponse.json({ assessmentId: assessment.id })

  } catch (error) {
    return NextResponse.json({ error: 'Server Failure', details: error.message }, { status: 500 })
  }
}
