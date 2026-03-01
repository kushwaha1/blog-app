# BlogApp — React + Node.js

Full-stack blog application with React frontend and Express/MongoDB backend.

## Project Structure
```
blog-react/
├── client/     → React frontend (port 3000)
└── server/     → Express API backend (port 5000)
```

## Setup & Run

### Prerequisites
- Node.js v14+
- MongoDB running locally

### Step 1: Start the Backend
```bash
cd server
npm install
# Edit .env if needed (MONGO_URI, JWT_SECRET)
node app.js
# Server runs at http://localhost:5000
```

### Step 2: Start the React Frontend
```bash
cd client
npm install
npm start
# App opens at http://localhost:3000
```

> Both must run simultaneously in separate terminals.

## Features
- ✅ Signup with profile image upload
- ✅ Login with JWT authentication
- ✅ Dashboard with profile image on the right
- ✅ Blog CRUD (Create, Read, Update, Delete)
- ✅ View full blog with dedicated page
- ✅ Delete confirmation modal
- ✅ Comments + nested replies (bonus)
- ✅ Toast notifications
- ✅ Protected routes
