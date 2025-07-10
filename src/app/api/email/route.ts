import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, sendWelcomeEmail, sendOrderConfirmationEmail, sendPasswordResetEmail, testEmailConfig } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { type, to, data } = await request.json()

    if (!to) {
      return NextResponse.json(
        { error: 'Recipient email is required' },
        { status: 400 }
      )
    }

    let result

    switch (type) {
      case 'welcome':
        if (!data?.name) {
          return NextResponse.json(
            { error: 'Name is required for welcome email' },
            { status: 400 }
          )
        }
        result = await sendWelcomeEmail(to, data.name)
        break

      case 'order-confirmation':
        if (!data?.orderId || !data?.customerName || !data?.total) {
          return NextResponse.json(
            { error: 'Order data is incomplete' },
            { status: 400 }
          )
        }
        result = await sendOrderConfirmationEmail(to, data)
        break

      case 'password-reset':
        if (!data?.resetLink || !data?.name) {
          return NextResponse.json(
            { error: 'Reset link and name are required' },
            { status: 400 }
          )
        }
        result = await sendPasswordResetEmail(to, data.resetLink, data.name)
        break

      case 'custom':
        if (!data?.subject || (!data?.html && !data?.text)) {
          return NextResponse.json(
            { error: 'Subject and content are required for custom email' },
            { status: 400 }
          )
        }
        result = await sendEmail({
          to,
          subject: data.subject,
          html: data.html,
          text: data.text,
        })
        break

      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        )
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully',
        messageId: result.messageId,
      })
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Email API error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}

// Test email configuration
export async function GET() {
  try {
    const result = await testEmailConfig()
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
      })
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Email config test error:', error)
    return NextResponse.json(
      { error: 'Failed to test email configuration' },
      { status: 500 }
    )
  }
}
