import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../lib/supabase'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, whatsapp, college, answers } = body
    const supabase = getSupabaseAdmin()

    // 1. Check if user already exists by Email
    let userId = null;
    const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).single()
    
    if (existingUser) {
      // User exists! Grab their ID.
      userId = existingUser.id;
      
      // Update their old profile with the fresh name and details from the frontend
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          name: name, 
          whatsapp: whatsapp, 
          college: college 
        })
        .eq('id', userId);
        
      if (updateError) {
        console.error("Failed to update user details", updateError);
      }

    } else {
      // Completely new user! Create a brand new profile.
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert([{ 
          name: name, 
          email: email, 
          whatsapp: whatsapp,
          college: college 
        }])
        .select('id')
        .single()

      if (userError) {
        return NextResponse.json({ error: 'User Table Error', details: userError }, { status: 500 })
      }
      userId = user.id
    }

    // 2. Save their 60-question Assessment to the database
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .insert([{
        user_id: userId,
        raw_answers: answers, 
        payment_status: true
      }])
      .select('id')
      .single()

    if (assessmentError) {
      return NextResponse.json({ error: 'Assessment Error', details: assessmentError }, { status: 500 })
    }

    // 3. Send the Assessment ID back to the frontend so it can route to the results page
    return NextResponse.json({ assessmentId: assessment.id })

  } catch (error) {
    return NextResponse.json({ error: 'Server Failure', details: error.message }, { status: 500 })
  }
}
