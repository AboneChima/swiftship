import nodemailer from 'nodemailer'
import * as brevo from '@getbrevo/brevo'
import dotenv from 'dotenv'

dotenv.config()

// Create transporter
const createTransporter = () => {
  // Use Brevo for production (300 emails/day free)
  if (process.env.BREVO_API_KEY) {
    console.log('Using Brevo SMTP for email service')
    return nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.BREVO_LOGIN,
        pass: process.env.BREVO_API_KEY,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
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
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; }
        .message { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #3b82f6; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; padding: 20px; }
        .badge { display: inline-block; background: #3b82f6; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; margin-bottom: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">✈ SwiftShip Express</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Important Notification</p>
        </div>
        <div class="content">
          <div class="badge">📧 Message from SwiftShip Team</div>
          <h2 style="color: #1e40af; margin-top: 0;">${subject}</h2>
          <div class="message">
            <div style="white-space: pre-wrap; color: #374151;">${message}</div>
          </div>
          <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
            This is an official notification from SwiftShip Express regarding your account or shipment.
          </p>
        </div>
        <div class="footer">
          <p style="margin: 5px 0;"><strong>SwiftShip Express</strong> - Global Logistics Solutions</p>
          <p style="margin: 5px 0;">87 George Street DURHAM DH6 6YK</p>
          <p style="margin: 5px 0;">
            <a href="mailto:info@swiftshipexpress.com" style="color: #3b82f6; text-decoration: none;">info@swiftshipexpress.com</a> | 
            <a href="http://www.swiftshipexpress.com" style="color: #3b82f6; text-decoration: none;">www.swiftshipexpress.com</a>
          </p>
          <p style="margin: 15px 0 5px 0; font-size: 12px; color: #9ca3af;">
            You received this email because you have an account with SwiftShip Express.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Package registration email template
const getPackageRegistrationTemplate = (packageData) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .tracking-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #3b82f6; text-align: center; }
        .tracking-number { font-size: 24px; font-weight: bold; color: #1e40af; font-family: monospace; letter-spacing: 2px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
        .info-item { background: white; padding: 15px; border-radius: 8px; }
        .info-label { font-size: 12px; color: #6b7280; font-weight: bold; margin-bottom: 5px; }
        .info-value { font-size: 14px; color: #1f2937; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✈ Package Registered Successfully!</h1>
        </div>
        <div class="content">
          <h2>Hello ${packageData.receiver_name}!</h2>
          <p>Your package has been registered with SwiftShip Express. You can now track your shipment using the tracking number below.</p>
          
          <div class="tracking-box">
            <div style="font-size: 14px; color: #6b7280; margin-bottom: 10px;">TRACKING NUMBER</div>
            <div class="tracking-number">${packageData.tracking_number}</div>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">FROM</div>
              <div class="info-value">${packageData.sender_name}</div>
              <div class="info-value" style="font-size: 12px; color: #6b7280;">${packageData.sender_country}</div>
            </div>
            <div class="info-item">
              <div class="info-label">TO</div>
              <div class="info-value">${packageData.receiver_name}</div>
              <div class="info-value" style="font-size: 12px; color: #6b7280;">${packageData.receiver_country}</div>
            </div>
            <div class="info-item">
              <div class="info-label">PRODUCT</div>
              <div class="info-value">${packageData.product_name}</div>
            </div>
            <div class="info-item">
              <div class="info-label">WEIGHT</div>
              <div class="info-value">${packageData.weight} kg</div>
            </div>
          </div>

          <p>Track your package anytime by visiting our website and entering your tracking number.</p>
          
          <div style="text-align: center;">
            <a href="${process.env.APP_URL || 'http://localhost:5173'}" class="button">Track Package</a>
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

// Send package registration email
export const sendPackageRegistrationEmail = async (packageData) => {
  // Try Brevo API first
  if (process.env.BREVO_API_KEY) {
    try {
      console.log('Sending package registration email via Brevo API')
      const apiInstance = new brevo.TransactionalEmailsApi()
      apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY)
      
      const sendSmtpEmail = new brevo.SendSmtpEmail()
      sendSmtpEmail.sender = { name: 'SwiftShip Express', email: process.env.BREVO_FROM_EMAIL }
      sendSmtpEmail.to = [{ email: packageData.receiver_email, name: packageData.receiver_name }]
      sendSmtpEmail.subject = `Package Registered - Tracking #${packageData.tracking_number}`
      sendSmtpEmail.htmlContent = getPackageRegistrationTemplate(packageData)
      
      const result = await apiInstance.sendTransacEmail(sendSmtpEmail)
      console.log('Package registration email sent:', result.messageId)
      return { success: true, messageId: result.messageId }
    } catch (error) {
      console.error('Brevo API error:', error.message)
      return { success: false, error: error.message }
    }
  }
  
  // Fallback to SMTP
  try {
    const transporter = createTransporter()
    
    const fromEmail = process.env.BREVO_FROM_EMAIL || process.env.SMTP_USER
    
    const mailOptions = {
      from: `"SwiftShip Express" <${fromEmail}>`,
      to: packageData.receiver_email,
      subject: `Package Registered - Tracking #${packageData.tracking_number}`,
      html: getPackageRegistrationTemplate(packageData),
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Package registration email sent via SMTP:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending package registration email:', error)
    return { success: false, error: error.message }
  }
}

// Send welcome email using Brevo API (fallback to SMTP) - DEPRECATED
export const sendWelcomeEmail = async (userEmail, userName) => {
  // Try Brevo API first (more reliable on hosting platforms)
  if (process.env.BREVO_API_KEY) {
    try {
      console.log('Using Brevo API for email')
      const apiInstance = new brevo.TransactionalEmailsApi()
      apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY)
      
      const sendSmtpEmail = new brevo.SendSmtpEmail()
      sendSmtpEmail.sender = { name: 'SwiftShip Express', email: process.env.BREVO_FROM_EMAIL }
      sendSmtpEmail.to = [{ email: userEmail, name: userName }]
      sendSmtpEmail.subject = 'Welcome to SwiftShip Express! 🚀'
      sendSmtpEmail.htmlContent = getWelcomeEmailTemplate(userName)
      
      const result = await apiInstance.sendTransacEmail(sendSmtpEmail)
      console.log('Welcome email sent via API:', result.messageId)
      return { success: true, messageId: result.messageId }
    } catch (error) {
      console.error('Brevo API error, falling back to SMTP:', error.message)
    }
  }
  
  // Fallback to SMTP
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
    console.log('Welcome email sent via SMTP:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return { success: false, error: error.message }
  }
}

// Send custom email with optional attachment using Brevo API (fallback to SMTP)
export const sendCustomEmail = async (userEmail, userName, subject, message, attachment = null) => {
  // Try Brevo API first (more reliable on hosting platforms)
  if (process.env.BREVO_API_KEY) {
    try {
      console.log('Using Brevo API for email')
      const apiInstance = new brevo.TransactionalEmailsApi()
      apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY)
      
      const sendSmtpEmail = new brevo.SendSmtpEmail()
      sendSmtpEmail.sender = { name: 'SwiftShip Express', email: process.env.BREVO_FROM_EMAIL }
      sendSmtpEmail.to = [{ email: userEmail, name: userName }]
      sendSmtpEmail.subject = subject
      sendSmtpEmail.htmlContent = getCustomEmailTemplate(subject, message)
      
      // Add attachment if provided
      if (attachment) {
        sendSmtpEmail.attachment = [{
          content: attachment.content,
          name: attachment.filename
        }]
      }
      
      const result = await apiInstance.sendTransacEmail(sendSmtpEmail)
      console.log('Custom email sent via API:', result.messageId)
      return { success: true, messageId: result.messageId }
    } catch (error) {
      console.error('Brevo API error, falling back to SMTP:', error.message)
    }
  }
  
  // Fallback to SMTP
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
    console.log('Custom email sent via SMTP:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending custom email:', error)
    return { success: false, error: error.message }
  }
}
