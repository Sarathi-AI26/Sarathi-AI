// app/api/contact/route.js
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request) {
  try {
    // 1. Grab the data sent from the frontend form
    const body = await request.json()
    const { name, designation, institution, email, batchSize } = body

    // 2. Configure your email server (SMTP)
    // We use environment variables here so your password isn't exposed in the code
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.zoho.in', 
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // 3. Format the email that will be sent to your admin inbox
    const mailOptions = {
      from: process.env.EMAIL_USER,         // Your server sends the email from your admin account
      to: 'admin@sarathiapp.in',            // It sends it TO your admin account
      replyTo: email,                       // If you hit "Reply", it replies directly to the student/TPO!
      subject: `🚨 New Campus Demo Request: ${institution}`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
          <h2 style="color: #0A2351; margin-top: 0;">New Campus Demo Request</h2>
          <p style="color: #475569; font-size: 14px;">A new institution has requested a preview of the SARATHI dashboard.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; font-weight: bold; color: #0A2351; width: 150px;">Name</td>
              <td style="padding: 12px 0; color: #334155;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; font-weight: bold; color: #0A2351;">Designation</td>
              <td style="padding: 12px 0; color: #334155;">${designation || 'Not provided'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; font-weight: bold; color: #0A2351;">Institution</td>
              <td style="padding: 12px 0; color: #334155;">${institution}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; font-weight: bold; color: #0A2351;">Email</td>
              <td style="padding: 12px 0; color: #F57D14;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-weight: bold; color: #0A2351;">Batch Size</td>
              <td style="padding: 12px 0; color: #334155;">${batchSize || 'Not specified'}</td>
            </tr>
          </table>
        </div>
      `,
    }

    // 4. Send the email
    await transporter.sendMail(mailOptions)

    // 5. Tell the frontend the submission was successful
    return NextResponse.json({ success: true, message: 'Email sent securely' }, { status: 200 })
    
  } catch (error) {
    console.error('Contact form email failed:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
