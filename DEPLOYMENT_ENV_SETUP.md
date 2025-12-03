# 🚀 Environment Variables Setup for Production

## 📦 Vercel (Frontend)

Go to your Vercel project dashboard and add these environment variables:

**Project:** prj_GEPbU5xxsHjs7RO3rUaR7KNqXVus

### Variables to Add:

```
VITE_API_URL=https://swiftship-api.onrender.com
```

That's all Vercel needs! The frontend doesn't need SMTP credentials.

---

## 🔧 Render (Backend)

Go to your Render dashboard → Your service → Environment

### Variables to Add:

```
JWT_SECRET=93c001f67f8f37013087acb923cccbc31ab6fac7b0bfeb6e86077c3ed64f91b846ea76c2d23d70c532da00191d487c2b066972dd42e73745889f775652ee4b3a

PORT=5000

POSTGRES_URL=postgres://75fce7622ce493cdd8f5c6ab05849310b523c4685931c40e32311634496179f5:sk_jXhdcU9W5Arr5o76HyDcT@db.prisma.io:5432/postgres?sslmode=require

NODE_ENV=production

SMTP_HOST=smtp.gmail.com

SMTP_PORT=587

SMTP_USER=deoraclee@gmail.com

SMTP_PASS=xnqswkbjxfqnawwv

APP_URL=https://consignment-site.vercel.app
```

---

## ✅ Quick Steps:

### For Vercel:
1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add `VITE_API_URL` = `https://swiftship-api.onrender.com`
5. Click Save

### For Render:
1. Go to: https://dashboard.render.com
2. Select your backend service
3. Go to Environment tab
4. Add all the variables listed above
5. Click Save Changes
6. Render will automatically redeploy

---

## 🔄 After Adding Variables:

**Vercel:** Will auto-redeploy when you push to GitHub
**Render:** Will auto-redeploy after saving environment variables

Your email system will be live! ✉️
