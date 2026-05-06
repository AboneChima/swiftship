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
                  <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: normal;">SwiftShip Express</h1>
                  <p style="margin: 6px 0 0 0; color: #dbeafe; font-size: 13px;">Shipment Confirmation</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px 20px;">
                  <p style="margin: 0 0 16px 0; color: #111827; font-size: 15px;">Hello ${packageData.receiver_name},</p>
                  <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 14px; line-height: 1.5;">Your shipment has been registered and is ready for tracking. Use your tracking number below to monitor your package:</p>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                    <tr>
                      <td style="background-color: #dbeafe; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; text-align: center;">
                        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; font-weight: bold;">TRACKING NUMBER</p>
                        <p style="margin: 0; color: #1e40af; font-size: 20px; font-weight: bold; font-family: monospace; letter-spacing: 1px;">${packageData.tracking_number}</p>
                      </td>
                    </tr>
                  </table>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                    <tr>
                      <td width="50%" style="padding: 10px; background-color: #f9fafb; border-radius: 6px;">
                        <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 11px; font-weight: bold;">FROM</p>
                        <p style="margin: 0; color: #111827; font-size: 14px; font-weight: bold;">${packageData.sender_name}</p>
                        <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 12px;">${packageData.sender_country || 'N/A'}</p>
                      </td>
                      <td width="50%" style="padding: 10px; background-color: #f9fafb; border-radius: 6px;">
                        <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 11px; font-weight: bold;">PRODUCT</p>
                        <p style="margin: 0; color: #111827; font-size: 14px; font-weight: bold;">${packageData.product_name || 'Package'}</p>
                        <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 12px;">${packageData.weight} kg</p>
                      </td>
                    </tr>
                  </table>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                    <tr>
                      <td align="center">
                        <a href="https://swiftshipexpress.live/tracking" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 5px; font-size: 14px; font-weight: normal;">Track Your Package</a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 16px 0 0 0; color: #6b7280; font-size: 13px; line-height: 1.5;">You can track your shipment anytime at swiftshipexpress.live</p>
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

// Send package registration email
export const sendPackageRegistrationEmail = async (packageData) => {
  if (!process.env.BREVO_API_KEY) {
    console.log('Brevo API key not configured, skipping email')
    return { success: false, error: 'Email service not configured' }
  }

  if (!packageData.receiver_email) {
    console.log('No receiver email provided, skipping email')
    return { success: false, error: 'No receiver email' }
  }

  try {
    console.log('Sending package registration email via Brevo API to:', packageData.receiver_email)
    const apiInstance = new brevo.TransactionalEmailsApi()
    apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY)
    
    const sendSmtpEmail = new brevo.SendSmtpEmail()
    sendSmtpEmail.sender = { 
      name: 'SwiftShip Express', 
      email: process.env.BREVO_FROM_EMAIL || 'noreply@swiftshipexpress.live' 
    }
    sendSmtpEmail.replyTo = { 
      name: 'SwiftShip Express', 
      email: 'noreply@swiftshipexpress.live' 
    }
    sendSmtpEmail.to = [{ 
      email: packageData.receiver_email, 
      name: packageData.receiver_name 
    }]
    sendSmtpEmail.subject = `Your Package ${packageData.tracking_number} is Registered`
    sendSmtpEmail.htmlContent = getPackageRegistrationTemplate(packageData)
    sendSmtpEmail.textContent = `Hello ${packageData.receiver_name},\n\nYour package has been registered with SwiftShip Express.\n\nTracking Number: ${packageData.tracking_number}\nFrom: ${packageData.sender_name}, ${packageData.sender_country}\nProduct: ${packageData.product_name}\nWeight: ${packageData.weight} kg\n\nTrack your package at: https://swiftshipexpress.live/tracking\n\nBest regards,\nSwiftShip Express Team`
    sendSmtpEmail.tags = ['package-registration', 'transactional']
    
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log('Package registration email sent:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Failed to send package registration email:', error.message)
    return { success: false, error: error.message }
  }
}
