// app/api/campus/claim-seat/route.js
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const body = await request.json()
    const { assessmentId, institutionId } = body

    if (!assessmentId || !institutionId) {
      return NextResponse.json({ error: 'assessmentId and institutionId are required' }, { status: 400 })
    }

    // Initialize Admin Client (Bypasses RLS to debit seats)
    // IMPORTANT: Make sure SUPABASE_SERVICE_ROLE_KEY is in your Vercel Environment Variables!
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY 
    )

    // 1. Fetch institution and check seats
    const { data: institution, error: instError } = await supabaseAdmin
      .from('institutions')
      .select('id, name, seats_purchased, seats_used, active, pilot')
      .eq('id', institutionId)
      .single()

    if (instError || !institution) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 })
    }

    if (!institution.active) {
      return NextResponse.json({ error: 'This institution is no longer active' }, { status: 403 })
    }

    const seatsRemaining = institution.seats_purchased - institution.seats_used
    if (seatsRemaining <= 0 && !institution.pilot) {
      return NextResponse.json({ error: 'No seats remaining for this institution' }, { status: 403 })
    }

    // 2. Debit one seat
    const { error: seatError } = await supabaseAdmin
      .from('institutions')
      .update({ seats_used: institution.seats_used + 1 })
      .eq('id', institutionId)

    if (seatError) throw seatError

    // 3. Mark assessment as institution-paid
    const { error: assessmentError } = await supabaseAdmin
      .from('assessments')
      .update({
        payment_status: true,
        institution_id: institutionId,
      })
      .eq('id', assessmentId)

    if (assessmentError) {
      // Rollback seat debit
      await supabaseAdmin
        .from('institutions')
        .update({ seats_used: institution.seats_used })
        .eq('id', institutionId)
      throw assessmentError
    }

    return NextResponse.json({
      ok: true,
      institution_name: institution.name,
      seats_remaining: seatsRemaining - 1,
    })

  } catch (error) {
    console.error('Claim seat error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
