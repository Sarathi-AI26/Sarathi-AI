import { NextResponse } from 'next/server'
import crypto from 'crypto'
import nodemailer from 'nodemailer' // Added Nodemailer import

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

      // ==========================================
      // EMAIL NOTIFICATION BLOCK START
      // ==========================================
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST || 'smtp.zoho.in',
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: 'admin@sarathiapp.in',
          subject: `💰 New Payment Received! (₹99)`,
          html: `
            <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background-color: #f8fafc;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #10b981; margin: 0;">₹99 Paid!</h1>
                <p style="color: #475569; font-size: 14px;">A new student just unlocked their SARATHI roadmap.</p>
              </div>
              
              <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 12px 16px; font-weight: bold; color: #0A2351; width: 150px;">Assessment ID</td>
                  <td style="padding: 12px 16px; color: #334155; font-family: monospace;">${assessmentId}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 12px 16px; font-weight: bold; color: #0A2351;">Razorpay Order</td>
                  <td style="padding: 12px 16px; color: #334155; font-family: monospace;">${razorpay_order_id}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; font-weight: bold; color: #0A2351;">Razorpay Payment</td>
                  <td style="padding: 12px 16px; color: #334155; font-family: monospace;">${razorpay_payment_id}</td>
                </tr>
              </table>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Admin payment notification email sent!");
      } catch (emailError) {
        // Failing silently so the user still gets their dashboard unlock
        console.error("Failed to send admin payment notification:", emailError);
      }
      // ==========================================
      // EMAIL NOTIFICATION BLOCK END
      // ==========================================

      return NextResponse.json({ success: true, message: "Payment verified" })
    } else {
      return NextResponse.json({ success: false, error: "Payment verification failed" }, { status: 400 })
    }

  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
