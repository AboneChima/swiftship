import jwt from 'jsonwebtoken'
import prisma from '../_prisma.js'
import * as brevo from '@getbrevo/brevo'

async function authenticateAdmin(req) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    throw new Error('No token provided')
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, name: true, email: true, role: true }
  })

  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  return user
}

// Email template
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
              <tr>
                <td style="background-color: #3b82f6; padding: 30px 20px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px;">✈ SwiftShip Express</h1>
                  <p style="margin: 8px 0 0 0; color: #dbeafe; font-size: 14px;">Important Notification</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px 20px;">
                  <h2 style="margin: 15px 0; color: #1e40af; font-size: 20px;">${subject}</h2>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                    <tr>
                      <td style="background-color: #f9fafb; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 6px;">
                        <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
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

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await authenticateAdmin(req)
  } catch (err) {
    return res.status(401).json({ message: err.message })
  }

  // Get data from body (Vercel automatically parses it)
  const email = req.body.recipientEmail
  const name = req.body.recipientName
  const subject = req.body.subject
  const message = req.body.message

  if (!email || !subject || !message) {
    return res.status(400).json({ message: 'Email, subject, and message are required' })
  }

  // Send email using Brevo API
  if (!process.env.BREVO_API_KEY) {
    return res.status(500).json({ message: 'Email service not configured' })
  }

  try {
    const apiInstance = new brevo.TransactionalEmailsApi()
    apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY)
    
    const sendSmtpEmail = new brevo.SendSmtpEmail()
    sendSmtpEmail.sender = { name: 'SwiftShip Express', email: process.env.BREVO_FROM_EMAIL || 'noreply@swiftshipexpress.live' }
    sendSmtpEmail.replyTo = { name: 'SwiftShip Express', email: 'noreply@swiftshipexpress.live' }
    sendSmtpEmail.to = [{ email, name: name || email }]
    sendSmtpEmail.subject = subject
    sendSmtpEmail.htmlContent = getCustomEmailTemplate(subject, message)
    sendSmtpEmail.textContent = `${message}\n\nBest regards,\nSwiftShip Express Team`
    sendSmtpEmail.tags = ['admin-notification', 'transactional']
    
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail)
    
    res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      messageId: result.messageId 
    })
  } catch (error) {
    console.error('Email send error:', error)
    res.status(500).json({ 
      message: 'Failed to send email', 
      error: error.message 
    })
  }
}
