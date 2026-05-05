import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req) {
  try {
    // 1. Get the raw body and signature from Razorpay
    const body = await req.text()
    const signature = req.headers.get('x-razorpay-signature')
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 })
    }

    // 2. Verify the signature matches our Vercel Environment Variable
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex')

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // 3. Parse the data
    const event = JSON.parse(body)

    // 4. Handle the successful payment event
    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      // The payment data lives inside event.payload
      const paymentData = event.payload.payment.entity
      
      console.log('Payment Captured Successfully!', paymentData.id)

      // TODO: Connect to MongoDB here and update the user's status.
      // Example: await db.collection('assessments').updateOne({ _id: assessmentId }, { $set: { payment_status: true } })
    }

    // Always return 200 OK so Razorpay knows we received the message
    return NextResponse.json({ status: 'ok' }, { status: 200 })

  } catch (error) {
    console.error('Webhook verification error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
