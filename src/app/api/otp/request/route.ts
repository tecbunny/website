import { NextRequest, NextResponse } from 'next/server';
import { storeOTP } from '../../../../lib/otp-store';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { email, full_name, password } = await request.json();

    if (!email || !full_name || !password) {
      return NextResponse.json(
        { error: 'Email, full name, and password are required' },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    storeOTP(email, otp, { full_name, password });

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // Send to superadmin
      subject: 'Admin Registration OTP - TecBunny Solutions',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Admin Registration Request</h2>
          <p>A new admin registration request has been submitted with the following details:</p>
          <ul>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Name:</strong> ${full_name}</li>
          </ul>
          <p>Your OTP code is: <strong style="font-size: 24px; color: #007bff;">${otp}</strong></p>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you did not request this registration, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully to superadmin email',
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
