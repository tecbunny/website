import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail, sendTestEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { type, to, data } = await request.json();

    if (!to) {
      return NextResponse.json(
        { error: 'Recipient email is required' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'welcome':
        if (!data?.name) {
          return NextResponse.json(
            { error: 'Name is required for welcome email' },
            { status: 400 }
          );
        }
        result = await sendWelcomeEmail(to, data.name);
        break;

      case 'test':
        result = await sendTestEmail(to);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    if (result.success) {
      return NextResponse.json({ 
        message: 'Email sent successfully',
        type 
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send email', details: result.error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Test email configuration
    const testResult = await sendTestEmail('test@tecbunny.com');
    
    return NextResponse.json({
      message: 'Email configuration test completed',
      success: testResult.success,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Email configuration test failed:', error);
    return NextResponse.json(
      { error: 'Email configuration test failed', details: error },
      { status: 500 }
    );
  }
}
