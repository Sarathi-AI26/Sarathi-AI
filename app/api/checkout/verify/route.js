import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, assessmentId } = await request.json()

    // 1. Create the string we need to verify
    const body = razorpay_order_id + "|" + razorpay_payment_id

    // 2. Hash it with our backend secret
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex')

    // 3. Check if it matches what Razorpay sent us
    const isAuthentic = expectedSignature === razorpay_signature

    if (isAuthentic) {
      // PAYMENT IS VALID! 
      
      // TODO: Connect to MongoDB here and update the assessment document.
      // Example: 
      // await connectToDatabase();
      // await Assessment.findByIdAndUpdate(assessmentId, { payment_status: true });

      return NextResponse.json({ success: true, message: "Payment verified" })
    } else {
      return NextResponse.json({ success: false, error: "Payment verification failed" }, { status: 400 })
    }

  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
