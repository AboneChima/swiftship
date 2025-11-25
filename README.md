# SwiftShip - Consignment & Delivery System

Modern, clean, and professional consignment tracking system built with React, Node.js, and SQLite.

## Features

- 🔐 User authentication (signup/login)
- 📦 Package tracking
- 👤 User dashboard
- 🛠️ Admin panel (manage packages & users)
- 🖨️ Receipt printing
- 📱 Responsive design

## Tech Stack

**Frontend:**
- React 18
- React Router
- Tailwind CSS
- Axios
- react-to-print

**Backend:**
- Node.js
- Express
- SQLite (better-sqlite3)
- JWT authentication
- bcrypt

## Getting Started

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Setup Environment

Create a \`.env\` file:

\`\`\`
JWT_SECRET=your-secret-key-change-this
PORT=5000
\`\`\`

### 3. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

This starts both frontend (port 3000) and backend (port 5000).

### 4. Default Admin Account

- Email: admin@swiftship.com
- Password: admin123

## Project Structure

\`\`\`
├── src/                    # Frontend React app
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── context/           # React context (Auth)
│   └── main.jsx           # Entry point
├── server/                # Backend API
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   └── db.js              # Database setup
└── package.json
\`\`\`

## API Endpoints

### Auth
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/auth/me

### Packages
- GET /api/packages (admin)
- GET /api/packages/my-packages (user)
- GET /api/packages/track/:trackingNumber (public)
- POST /api/packages (admin)
- PUT /api/packages/:id (admin)
- DELETE /api/packages/:id (admin)

### Admin
- GET /api/admin/users

## Deployment

**Frontend:** Deploy to Vercel/Netlify
**Backend:** Deploy to Railway/Render
**Database:** SQLite (or migrate to PostgreSQL for production)

## License

MIT
