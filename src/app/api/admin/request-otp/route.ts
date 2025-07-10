import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { otpStore } from '@/lib/otp-store'
import nodemailer from 'nodemailer'

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'tecbunnysolution@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD // You'll need to set this in .env.local
  }
})

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json()

    // Validation
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      )
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = Date.now() + 10 * 60 * 1000 // 10 minutes

    // Store OTP with registration data
    const requestId = `admin_reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    otpStore.set(requestId, {
      otp,
      expires,
      requestData: { email, password, fullName }
    })

    // Send OTP email to superadmin
    const superAdminEmail = 'tecbunnysolution@gmail.com'
    
    const mailOptions = {
      from: 'TecBunny Solutions <tecbunnysolution@gmail.com>',
      to: superAdminEmail,
      subject: 'TecBunny Admin Registration Request - OTP Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Admin Registration Request</h2>
          <p>A new admin registration request has been received:</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #555;">Registration Details:</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Request ID:</strong> ${requestId}</p>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1976d2;">OTP Code:</h3>
            <p style="font-size: 24px; font-weight: bold; color: #1976d2; margin: 0;">${otp}</p>
            <p style="font-size: 12px; color: #666; margin: 10px 0 0 0;">This OTP will expire in 10 minutes</p>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            If you did not expect this registration request, please ignore this email.
            Only approved personnel should have access to admin registration.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            This is an automated message from TecBunny Solutions Admin System.
          </p>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      message: 'OTP sent to superadmin email for verification',
      requestId,
      note: 'Please check tecbunnysolution@gmail.com for the OTP code'
    })

  } catch (error) {
    console.error('OTP send error:', error)
    return NextResponse.json(
      { error: 'Failed to send OTP verification' },
      { status: 500 }
    )
  }
}
