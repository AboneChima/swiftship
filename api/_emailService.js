import * as brevo from '@getbrevo/brevo'

// Package registration email template
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
              <tr>
                <td style="background-color: #3b82f6; padding: 25px 20px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 22px;">SwiftShip Express</h1>
                  <p style="margin: 6px 0 0 0; color: #dbeafe; font-size: 13px;">Shipment Confirmation</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px 20px;">
                  <p style="margin: 0 0 16px 0; color: #111827; font-size: 15px;">Hello ${packageData.receiver_name},</p>
                  <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 14px;">Your shipment has been registered. Track it using:</p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                    <tr>
                      <td style="background-color: #dbeafe; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; text-align: center;">
                        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; font-weight: bold;">TRACKING NUMBER</p>
                        <p style="margin: 0; color: #1e40af; font-size: 20px; font-weight: bold; font-family: monospace;">${packageData.tracking_number}</p>
                      </td>
                    </tr>
                  </table>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                    <tr>
                      <td align="center">
                        <a href="https://swiftshipexpress.live/tracking" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 5px; font-size: 14px;">Track Your Package</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 8px 0; color: #111827; font-size: 14px; font-weight: bold;">SwiftShip Express</p>
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
  if (!process.env.BREVO_API_KEY || !packageData.receiver_email) {
    console.log('Skipping email - no API key or receiver email')
    return { success: false, error: 'Missing configuration' }
  }

  try {
    console.log('Sending package registration email via Brevo API to:', packageData.receiver_email)
    const apiInstance = new brevo.TransactionalEmailsApi()
    apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY)
    
    const sendSmtpEmail = new brevo.SendSmtpEmail()
    sendSmtpEmail.sender = { name: 'SwiftShip Express', email: process.env.BREVO_FROM_EMAIL || 'noreply@swiftshipexpress.live' }
    sendSmtpEmail.to = [{ email: packageData.receiver_email, name: packageData.receiver_name }]
    sendSmtpEmail.subject = `Package Registered - Tracking #${packageData.tracking_number}`
    sendSmtpEmail.htmlContent = getPackageRegistrationTemplate(packageData)
    sendSmtpEmail.textContent = `Hello ${packageData.receiver_name},\n\nYour package has been registered.\n\nTracking Number: ${packageData.tracking_number}\n\nTrack at: https://swiftshipexpress.live/tracking`
    
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log('Email sent successfully:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Error sending email:', error.message)
    return { success: false, error: error.message }
  }
}
