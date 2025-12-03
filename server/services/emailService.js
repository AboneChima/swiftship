import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Create transporter
const createTransporter = () => {
  // Use Brevo for production (300 emails/day free)
  if (process.env.BREVO_API_KEY) {
    return nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_API_KEY,
      },
    })
  }
  
  // Fallback to Gmail for local development
  const config = {
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  }
  
  console.log('Using Gmail for email service')
  return nodemailer.createTransporter(config)
}

// Welcome email template
const getWelcomeEmailTemplate = (userName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✈ Welcome to SwiftShip Express!</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName}!</h2>
          <p>Thank you for creating an account with SwiftShip Express. We're excited to have you on board!</p>
          <p>With your new account, you can:</p>
          <ul>
            <li>Track your packages in real-time</li>
            <li>View delivery history</li>
            <li>Manage your shipments</li>
            <li>Get instant notifications</li>
          </ul>
          <p>If you have any questions or need assistance, our support team is always here to help.</p>
          <div style="text-align: center;">
            <a href="${process.env.APP_URL || 'http://localhost:5173'}" class="button">Go to Dashboard</a>
          </div>
        </div>
        <div class="footer">
          <p>SwiftShip Express - Global Logistics Solutions</p>
          <p>87 George Street DURHAM DH6 6YK</p>
          <p>info@swiftshipexpress.com | www.swiftshipexpress.com</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Custom email template
const getCustomEmailTemplate = (subject, message) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✈ SwiftShip Express</h1>
        </div>
        <div class="content">
          <h2>${subject}</h2>
          <div style="white-space: pre-wrap;">${message}</div>
        </div>
        <div class="footer">
          <p>SwiftShip Express - Global Logistics Solutions</p>
          <p>87 George Street DURHAM DH6 6YK</p>
          <p>info@swiftshipexpress.com | www.swiftshipexpress.com</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Send welcome email
export const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter()
    
    const fromEmail = process.env.BREVO_API_KEY 
      ? process.env.BREVO_FROM_EMAIL || 'noreply@swiftship.com'
      : process.env.SMTP_USER
    
    const mailOptions = {
      from: `"SwiftShip Express" <${fromEmail}>`,
      to: userEmail,
      subject: 'Welcome to SwiftShip Express! 🚀',
      html: getWelcomeEmailTemplate(userName),
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Welcome email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return { success: false, error: error.message }
  }
}

// Send custom email
export const sendCustomEmail = async (userEmail, userName, subject, message) => {
  try {
    const transporter = createTransporter()
    
    const fromEmail = process.env.BREVO_API_KEY 
      ? process.env.BREVO_FROM_EMAIL || 'noreply@swiftship.com'
      : process.env.SMTP_USER
    
    const mailOptions = {
      from: `"SwiftShip Express" <${fromEmail}>`,
      to: userEmail,
      subject: subject,
      html: getCustomEmailTemplate(subject, message),
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Custom email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending custom email:', error)
    return { success: false, error: error.message }
  }
}
