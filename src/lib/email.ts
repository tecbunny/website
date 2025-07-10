import nodemailer from 'nodemailer';

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Email templates
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: 'Welcome to TecBunny!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8b5cf6;">Welcome to TecBunny, ${name}!</h1>
        <p>Thank you for joining TecBunny, your trusted destination for premium computer and mobile accessories.</p>
        <p>We're excited to have you as part of our community!</p>
        <div style="margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products" 
             style="background-color: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Shop Now
          </a>
        </div>
        <p>Best regards,<br>The TecBunny Team</p>
      </div>
    `,
  }),

  orderConfirmation: (orderDetails: { orderId: string; items: Array<{ name: string; price: number; quantity: number }>; total: number; customerName: string }) => ({
    subject: `Order Confirmation - #${orderDetails.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8b5cf6;">Order Confirmed!</h1>
        <p>Hi ${orderDetails.customerName},</p>
        <p>Thank you for your order! We've received your order and it's being processed.</p>
        
        <div style="background: #f8fafc; padding: 20px; margin: 20px 0; border-radius: 6px;">
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> #${orderDetails.orderId}</p>
          <p><strong>Total:</strong> ₹${orderDetails.total.toLocaleString()}</p>
        </div>

        <div style="margin: 20px 0;">
          <h3>Items Ordered:</h3>
          ${orderDetails.items.map(item => `
            <div style="border-bottom: 1px solid #e2e8f0; padding: 10px 0;">
              <p><strong>${item.name}</strong></p>
              <p>Quantity: ${item.quantity} | Price: ₹${item.price.toLocaleString()}</p>
            </div>
          `).join('')}
        </div>

        <p>We'll send you another email when your order ships.</p>
        <p>Best regards,<br>The TecBunny Team</p>
      </div>
    `,
  }),
};

// Email sending functions
export const sendWelcomeEmail = async (email: string, name: string) => {
  const template = emailTemplates.welcome(name);
  
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME || 'TecBunny'} <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: template.subject,
    html: template.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully to:', email);
    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
};

// Test email function
export const sendTestEmail = async (email: string) => {
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME || 'TecBunny'} <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: 'TecBunny Email Test',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8b5cf6;">Email Test Successful!</h1>
        <p>This is a test email from TecBunny's email system.</p>
        <p>If you received this email, the configuration is working correctly.</p>
        <p>Timestamp: ${new Date().toLocaleString()}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Test email sent successfully to:', email);
    return { success: true };
  } catch (error) {
    console.error('Error sending test email:', error);
    return { success: false, error };
  }
};

export default transporter;