# Email Notification System - Setup Guide

## Overview
The email notification system has been successfully integrated into your SwiftShip tracking platform with two main features:

1. **Automatic Welcome Email** - Sent when users create a new account
2. **Admin Email System** - Allows admins to send custom emails to any registered user

## Setup Instructions

### 1. Configure Email Settings

Add the following environment variables to your `.env` file:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
APP_URL=http://localhost:5173
```

### 2. Email Provider Setup

#### Option A: Gmail (Recommended for Testing)

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password
   - Use this as `SMTP_PASS` in your `.env` file

**Gmail Settings:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-16-char-app-password
```

#### Option B: SendGrid (Recommended for Production)

1. Sign up at https://sendgrid.com
2. Create an API key
3. Use these settings:

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

#### Option C: Other SMTP Providers

- **Mailgun**: smtp.mailgun.org (Port 587)
- **AWS SES**: email-smtp.us-east-1.amazonaws.com (Port 587)
- **Outlook**: smtp-mail.outlook.com (Port 587)

### 3. Test the System

#### Test Welcome Email:
1. Start your server: `npm run dev`
2. Create a new user account
3. Check the email inbox for the welcome email

#### Test Admin Email:
1. Login as admin
2. Go to Admin Dashboard
3. Click the "Email" tab
4. Select a user, enter subject and message
5. Click "Send Email"

## Features

### Automatic Welcome Email
- Sent immediately after user registration
- Professional HTML template with SwiftShip branding
- Includes company information and call-to-action button
- Non-blocking (won't delay registration response)

### Admin Email System
- Located in Admin Dashboard under "Email" tab
- Select any registered user from dropdown
- Custom subject and message
- Real-time success/error feedback
- Character counter for message length
- Responsive design for mobile and desktop

## Email Templates

Both email types use professional HTML templates with:
- SwiftShip Express branding
- Gradient header with logo
- Responsive design
- Company contact information
- Professional styling

## Troubleshooting

### Email Not Sending

1. **Check SMTP credentials**
   ```bash
   # Verify .env file has correct values
   cat .env
   ```

2. **Check server logs**
   - Look for "Welcome email sent" or error messages
   - Check console for email service errors

3. **Gmail specific issues**
   - Ensure 2FA is enabled
   - Use App Password, not regular password
   - Check "Less secure app access" is OFF (use App Password instead)

4. **Firewall/Network issues**
   - Ensure port 587 is not blocked
   - Try port 465 with `secure: true` if 587 fails

### Common Errors

**"Invalid login"**
- Double-check SMTP_USER and SMTP_PASS
- For Gmail, ensure you're using App Password

**"Connection timeout"**
- Check SMTP_HOST and SMTP_PORT
- Verify network/firewall settings

**"Email sent but not received"**
- Check spam/junk folder
- Verify recipient email address
- Check email provider's sending limits

## Production Recommendations

1. **Use a dedicated email service** (SendGrid, Mailgun, AWS SES)
2. **Set up SPF and DKIM records** for better deliverability
3. **Monitor email sending limits** to avoid rate limiting
4. **Add email logging** to track sent emails
5. **Implement email queue** for high-volume sending
6. **Add unsubscribe functionality** for compliance

## File Structure

```
server/
  services/
    emailService.js          # Email service with templates
  routes/
    auth.js                  # Updated with welcome email
    admin.js                 # Added send-email endpoint

src/
  components/
    EmailNotification.jsx    # Admin email UI component
  pages/
    Admin.jsx               # Updated with Email tab
```

## API Endpoints

### POST /api/admin/send-email
Send custom email to a user (Admin only)

**Request:**
```json
{
  "userId": 1,
  "subject": "Important Update",
  "message": "Your message here..."
}
```

**Response:**
```json
{
  "message": "Email sent successfully",
  "messageId": "<message-id>"
}
```

## Security Notes

- Never commit `.env` file to version control
- Use App Passwords instead of regular passwords
- Implement rate limiting for email endpoints
- Validate and sanitize email content
- Admin authentication required for sending emails

## Next Steps

1. Configure your SMTP settings in `.env`
2. Test welcome email by creating a new account
3. Test admin email system from dashboard
4. Consider adding email templates for other events (password reset, order updates, etc.)
5. Set up email analytics/tracking if needed

## Support

If you encounter issues:
1. Check server console logs
2. Verify SMTP credentials
3. Test with a simple email client first
4. Check email provider documentation
