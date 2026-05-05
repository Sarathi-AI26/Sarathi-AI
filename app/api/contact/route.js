// app/api/contact/route.js
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    // 1. Grab the data sent from the frontend form
    const body = await request.json()
    const { name, designation, institution, email, batchSize } = body

    // 2. For now, we will log it to your Vercel server console.
    // Later, you can easily wire this up to save to Supabase or send you an email via Resend/SendGrid.
    console.log("🏫 New Campus Demo Request Received:")
    console.log(`Name: ${name}`)
    console.log(`Institution: ${institution}`)
    console.log(`Email: ${email}`)

    // 3. Simulate a quick 1-second delay so the user sees the "Sending..." loading spinner
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 4. Tell the frontend the submission was successful!
    return NextResponse.json({ success: true, message: 'Request received' }, { status: 200 })
    
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
