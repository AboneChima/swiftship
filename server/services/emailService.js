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

// Custom email template - Simple & Reliable
const getCustomEmailTemplate = (subject, message) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px 0;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #3b82f6; padding: 30px 20px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px;">✈ SwiftShip Express</h1>
                  <p style="margin: 8px 0 0 0; color: #dbeafe; font-size: 14px;">Important Notification</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 30px 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background-color: #dbeafe; padding: 8px 16px; border-radius: 20px; display: inline-block; margin-bottom: 15px;">
                        <p style="margin: 0; color: #1e40af; font-size: 12px; font-weight: bold;">📧 Message from SwiftShip</p>
                      </td>
                    </tr>
                  </table>
                  
                  <h2 style="margin: 15px 0; color: #1e40af; font-size: 20px;">${subject}</h2>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                    <tr>
                      <td style="background-color: #f9fafb; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 6px;">
                        <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 20px 0 0 0; color: #6b7280; font-size: 13px; line-height: 1.6;">This is an official notification from SwiftShip Express.</p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 8px 0; color: #111827; font-size: 14px; font-weight: bold;">SwiftShip Express</p>
                  <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px;">87 George Street DURHAM DH6 6YK</p>
                  <p style="margin: 0; color: #6b7280; font-size: 12px;">info@swiftshipexpress.live | www.swiftshipexpress.live</p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

// Package registration email template - Simple & Reliable
const getPackageRegistrationTemplate = (packageData) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px 0;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #3b82f6; padding: 25px 20px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: normal;">SwiftShip Express</h1>
                  <p style="margin: 6px 0 0 0; color: #dbeafe; font-size: 13px;">Shipment Confirmation</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 30px 20px;">
                  <p style="margin: 0 0 16px 0; color: #111827; font-size: 15px;">Hello ${packageData.receiver_name},</p>
                  <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 14px; line-height: 1.5;">Your shipment has been registered and is ready for tracking. Use your tracking number below to monitor your package:</p>
                  
                  <!-- Tracking Number Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                    <tr>
                      <td style="background-color: #dbeafe; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; text-align: center;">
                        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; font-weight: bold;">TRACKING NUMBER</p>
                        <p style="margin: 0; color: #1e40af; font-size: 20px; font-weight: bold; font-family: monospace; letter-spacing: 1px;">${packageData.tracking_number}</p>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Package Details -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                    <tr>
                      <td width="50%" style="padding: 10px; background-color: #f9fafb; border-radius: 6px;">
                        <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 11px; font-weight: bold;">FROM</p>
                        <p style="margin: 0; color: #111827; font-size: 14px; font-weight: bold;">${packageData.sender_name}</p>
                        <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 12px;">${packageData.sender_country}</p>
                      </td>
                      <td width="50%" style="padding: 10px; background-color: #f9fafb; border-radius: 6px;">
                        <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 11px; font-weight: bold;">PRODUCT</p>
                        <p style="margin: 0; color: #111827; font-size: 14px; font-weight: bold;">${packageData.product_name}</p>
                        <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 12px;">${packageData.weight} kg</p>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Track Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                    <tr>
                      <td align="center">
                        <a href="https://swiftshipexpress.live/tracking" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 5px; font-size: 14px; font-weight: normal;">Track Your Package</a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 16px 0 0 0; color: #6b7280; font-size: 13px; line-height: 1.5;">You can track your shipment anytime at swiftshipexpress.live</p>
                  
                  <p style="margin: 16px 0 0 0; color: #6b7280; font-size: 12px; line-height: 1.5;">If you have questions, contact us at info@swiftshipexpress.live</p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 8px 0; color: #111827; font-size: 14px; font-weight: bold;">SwiftShip Express</p>
                  <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px;">87 George Street DURHAM DH6 6YK</p>
                  <p style="margin: 0; color: #6b7280; font-size: 12px;">info@swiftshipexpress.live | www.swiftshipexpress.live</p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
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
      sendSmtpEmail.subject = `Your Package ${packageData.tracking_number} is Registered`
      sendSmtpEmail.htmlContent = getPackageRegistrationTemplate(packageData)
      sendSmtpEmail.textContent = `Hello ${packageData.receiver_name},\n\nYour package has been registered with SwiftShip Express.\n\nTracking Number: ${packageData.tracking_number}\nFrom: ${packageData.sender_name}, ${packageData.sender_country}\nProduct: ${packageData.product_name}\nWeight: ${packageData.weight} kg\n\nTrack your package at: https://swiftshipexpress.live/tracking\n\nBest regards,\nSwiftShip Express Team\n87 George Street DURHAM DH6 6YK\ninfo@swiftshipexpress.live`
      sendSmtpEmail.tags = ['package-registration', 'transactional']
      
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
      sendSmtpEmail.textContent = `Hello ${userName},\n\n${message}\n\nBest regards,\nSwiftShip Express Team\n87 George Street DURHAM DH6 6YK\ninfo@swiftshipexpress.live`
      sendSmtpEmail.tags = ['admin-notification', 'transactional']
      
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
