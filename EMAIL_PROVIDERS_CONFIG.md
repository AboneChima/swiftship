# 📧 Email Provider Configurations

## Quick Reference for Different SMTP Providers

### 🔵 Gmail (Best for Testing)

**Setup Steps:**
1. Enable 2-Factor Authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character password

**Configuration:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
APP_URL=http://localhost:5173
```

**Limits:**
- 500 emails/day (free)
- 2000 emails/day (Google Workspace)

**Pros:** Easy setup, free, reliable
**Cons:** Daily limits, may go to spam

---

### 🟢 SendGrid (Recommended for Production)

**Setup Steps:**
1. Sign up: https://sendgrid.com
2. Verify your email
3. Create API Key: Settings → API Keys → Create API Key
4. Copy the API key

**Configuration:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your-actual-api-key-here
APP_URL=https://your-production-domain.com
```

**Limits:**
- 100 emails/day (free)
- 40,000+ emails/month (paid plans)

**Pros:** High deliverability, analytics, templates
**Cons:** Requires verification for higher limits

---

### 🟣 Mailgun (Great for Developers)

**Setup Steps:**
1. Sign up: https://www.mailgun.com
2. Add and verify your domain
3. Get SMTP credentials from: Sending → Domain Settings → SMTP

**Configuration:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-smtp-password
APP_URL=https://your-production-domain.com
```

**Limits:**
- 5,000 emails/month (free for 3 months)
- Pay-as-you-go after trial

**Pros:** Developer-friendly, good API, reliable
**Cons:** Requires domain verification

---

### 🔴 AWS SES (Best for Scale)

**Setup Steps:**
1. Sign up for AWS: https://aws.amazon.com
2. Go to Amazon SES
3. Verify your email/domain
4. Create SMTP credentials: SMTP Settings → Create SMTP Credentials

**Configuration:**
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-aws-smtp-username
SMTP_PASS=your-aws-smtp-password
APP_URL=https://your-production-domain.com
```

**Note:** Region-specific SMTP endpoints:
- US East (N. Virginia): `email-smtp.us-east-1.amazonaws.com`
- US West (Oregon): `email-smtp.us-west-2.amazonaws.com`
- EU (Ireland): `email-smtp.eu-west-1.amazonaws.com`

**Limits:**
- 200 emails/day (free tier)
- $0.10 per 1,000 emails after

**Pros:** Extremely scalable, cheap, AWS integration
**Cons:** Complex setup, requires AWS account

---

### 🔵 Outlook/Office 365

**Setup Steps:**
1. Use your Outlook/Office 365 account
2. Enable 2FA (recommended)
3. Use account password or app password

**Configuration:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
APP_URL=http://localhost:5173
```

**Limits:**
- 300 emails/day (Outlook.com)
- 10,000 emails/day (Office 365)

**Pros:** Good for business, reliable
**Cons:** Stricter spam filters

---

### 🟠 Brevo (formerly Sendinblue)

**Setup Steps:**
1. Sign up: https://www.brevo.com
2. Go to SMTP & API
3. Create SMTP key

**Configuration:**
```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-email@example.com
SMTP_PASS=your-smtp-key
APP_URL=https://your-production-domain.com
```

**Limits:**
- 300 emails/day (free)
- Unlimited contacts

**Pros:** Generous free tier, marketing features
**Cons:** Branding on free tier

---

### 🟡 Postmark (Transactional Email Specialist)

**Setup Steps:**
1. Sign up: https://postmarkapp.com
2. Create a server
3. Get SMTP credentials

**Configuration:**
```env
SMTP_HOST=smtp.postmarkapp.com
SMTP_PORT=587
SMTP_USER=your-server-token
SMTP_PASS=your-server-token
APP_URL=https://your-production-domain.com
```

**Limits:**
- 100 emails/month (free trial)
- Pay-as-you-go after

**Pros:** Excellent deliverability, fast, transactional focus
**Cons:** No free tier (after trial)

---

## 📊 Comparison Table

| Provider | Free Tier | Best For | Setup Difficulty | Deliverability |
|----------|-----------|----------|------------------|----------------|
| Gmail | 500/day | Testing | ⭐ Easy | ⭐⭐⭐ Good |
| SendGrid | 100/day | Production | ⭐⭐ Medium | ⭐⭐⭐⭐⭐ Excellent |
| Mailgun | 5k/month | Developers | ⭐⭐ Medium | ⭐⭐⭐⭐ Very Good |
| AWS SES | 200/day | Scale | ⭐⭐⭐ Hard | ⭐⭐⭐⭐ Very Good |
| Outlook | 300/day | Business | ⭐ Easy | ⭐⭐⭐ Good |
| Brevo | 300/day | Marketing | ⭐⭐ Medium | ⭐⭐⭐⭐ Very Good |
| Postmark | Trial only | Transactional | ⭐⭐ Medium | ⭐⭐⭐⭐⭐ Excellent |

---

## 🎯 Recommendations

### For Development/Testing:
```
✅ Gmail
- Quick setup
- Free
- No verification needed
```

### For Small Production Apps:
```
✅ SendGrid or Brevo
- Good free tier
- Easy to scale
- Professional features
```

### For Large Scale:
```
✅ AWS SES or Mailgun
- Cost-effective at scale
- High deliverability
- Advanced features
```

### For Transactional Emails Only:
```
✅ Postmark
- Best deliverability
- Fast delivery
- Transactional focus
```

---

## 🔧 Testing Your Configuration

After updating `.env`, test with this command:

```bash
# Restart your server
npm run dev

# Create a test account or send admin email
# Check server logs for:
"Email sent: <message-id>"  ✅ Success
"Error sending email: ..."  ❌ Check config
```

---

## 🚨 Important Notes

### All Providers:
1. **Verify your domain** for better deliverability
2. **Set up SPF/DKIM records** to avoid spam
3. **Monitor sending limits** to avoid blocks
4. **Use environment variables** - never hardcode credentials
5. **Test thoroughly** before going to production

### Production Checklist:
- [ ] Domain verified with email provider
- [ ] SPF record added to DNS
- [ ] DKIM record added to DNS
- [ ] DMARC policy configured
- [ ] Unsubscribe link added (for marketing emails)
- [ ] Bounce handling implemented
- [ ] Rate limiting configured
- [ ] Email analytics set up

---

## 📝 Example: Switching Providers

To switch from Gmail to SendGrid:

1. **Get SendGrid API Key**
2. **Update .env:**
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=SG.your-api-key
   ```
3. **Restart server**
4. **Test email sending**

No code changes needed! 🎉

---

## 🆘 Provider-Specific Troubleshooting

### Gmail:
- **"Invalid login"** → Use App Password, not regular password
- **"Less secure app"** → Enable 2FA and use App Password
- **Emails in spam** → Normal for new senders

### SendGrid:
- **"Sender not verified"** → Verify your sender email
- **"Domain not verified"** → Add DNS records
- **Rate limited** → Upgrade plan or wait

### AWS SES:
- **"Email address not verified"** → Verify in SES console
- **"Sandbox mode"** → Request production access
- **Wrong region** → Use correct regional endpoint

### Mailgun:
- **"Domain not verified"** → Add DNS records
- **"Free trial expired"** → Add payment method
- **Emails not sending** → Check domain status

---

## 💡 Pro Tips

1. **Start with Gmail** for development
2. **Move to SendGrid/Mailgun** for production
3. **Use AWS SES** if you're already on AWS
4. **Always verify your domain** for production
5. **Monitor your email reputation**
6. **Keep backup provider** for redundancy
7. **Use email queue** for high volume
8. **Track email metrics** (opens, clicks, bounces)

---

## 📚 Additional Resources

- [Gmail SMTP Setup](https://support.google.com/mail/answer/7126229)
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [Mailgun Documentation](https://documentation.mailgun.com/)
- [AWS SES Documentation](https://docs.aws.amazon.com/ses/)
- [Email Deliverability Guide](https://www.validity.com/resource-center/email-deliverability-guide/)

---

**Need help choosing?** Start with Gmail for testing, then move to SendGrid for production. It's the easiest path! 🚀
