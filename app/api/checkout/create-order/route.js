import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

// Initialize Razorpay with your secret backend keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export async function POST(request) {
  try {
    const { assessmentId } = await request.json()

    if (!assessmentId) {
      return NextResponse.json({ error: 'Assessment ID is required' }, { status: 400 })
    }

    const options = {
      amount: 99 * 100, // ₹99 in paise (Razorpay requires paise)
      currency: 'INR',
      receipt: `rcpt_${assessmentId.slice(-8)}`, // Unique receipt id
    }

    // Call Razorpay to create the order
    const order = await razorpay.orders.create(options)

    return NextResponse.json({ 
      orderId: order.id, 
      amount: order.amount, 
      currency: order.currency 
    })

  } catch (error) {
    console.error("Razorpay Order Creation Error:", error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
