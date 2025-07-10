import nodemailer from 'nodemailer'

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
}

// Create transporter
const transporter = nodemailer.createTransporter(emailConfig)

// Email templates
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: 'Welcome to TecBunny!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to TecBunny!</h1>
        </div>
        <div style="padding: 40px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${name}!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Thank you for joining TecBunny! We're excited to have you as part of our community.
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Explore our wide range of tech products and enjoy exclusive deals just for you.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/products" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      font-weight: bold;">
              Start Shopping
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Best regards,<br>
            The TecBunny Team
          </p>
        </div>
      </div>
    `,
  }),

  orderConfirmation: (orderData: {
    orderId: string;
    customerName: string;
    total: string;
  }) => ({
    subject: `Order Confirmation - ${orderData.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed!</h1>
        </div>
        <div style="padding: 40px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${orderData.customerName}!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Thank you for your order! Your order has been confirmed and is being processed.
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Order Details</h3>
            <p><strong>Order ID:</strong> ${orderData.orderId}</p>
            <p><strong>Total Amount:</strong> ₹${orderData.total}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
          </div>
          <p style="color: #666; font-size: 14px;">
            We'll send you another email when your order ships.
          </p>
          <p style="color: #666; font-size: 14px;">
            Best regards,<br>
            The TecBunny Team
          </p>
        </div>
      </div>
    `,
  }),

  passwordReset: (resetLink: string, name: string) => ({
    subject: 'Reset Your TecBunny Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
        </div>
        <div style="padding: 40px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${name}!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            You requested to reset your password for your TecBunny account.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
          </p>
          <p style="color: #666; font-size: 14px;">
            Best regards,<br>
            The TecBunny Team
          </p>
        </div>
      </div>
    `,
  }),
}

// Send email function
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html?: string
  text?: string
}) {
  try {
    const info = await transporter.sendMail({
      from: `${process.env.EMAIL_FROM_NAME || 'TecBunny'} <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
      text,
    })

    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Helper functions for specific email types
export async function sendWelcomeEmail(to: string, name: string) {
  const template = emailTemplates.welcome(name)
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
  })
}

export async function sendOrderConfirmationEmail(to: string, orderData: {
  orderId: string;
  customerName: string;
  total: string;
}) {
  const template = emailTemplates.orderConfirmation(orderData)
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
  })
}

export async function sendPasswordResetEmail(to: string, resetLink: string, name: string) {
  const template = emailTemplates.passwordReset(resetLink, name)
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
  })
}

// Test email configuration
export async function testEmailConfig() {
  try {
    await transporter.verify()
    return { success: true, message: 'Email configuration is valid' }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Email configuration failed' 
    }
  }
}
