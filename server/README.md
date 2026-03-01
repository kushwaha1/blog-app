# BlogApp - Node.js Developer Task Submission

A full-stack blog application built with Node.js, Express, MongoDB (Mongoose), EJS, and Bootstrap 5.

## Features Implemented

### Authentication
- ✅ Sign Up with email, password validation, and profile image upload
- ✅ Login with JWT token generation
- ✅ Session-based authentication with redirect to dashboard
- ✅ Logout

### Dashboard
- ✅ Protected route (JWT middleware)
- ✅ Profile image displayed on the right side
- ✅ All user blogs listed in a table

### CRUD - Blog Posts
- ✅ **Create** – Add blog with title, image, and description (with validation)
- ✅ **Read** – List all blogs in table format with image, title, brief description
- ✅ **Update** – Edit all fields, image upload optional (keeps old if not replaced)
- ✅ **Delete** – Confirmation modal before deletion
- ✅ **View Button** – Individual blog view page per table row

### Bonus: Comments & Replies
- ✅ Add comments to any blog post
- ✅ Reply to specific comments (nested replies)
- ✅ All stored in MongoDB alongside the blog

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Sessions | express-session + connect-flash |
| Views | EJS templating |
| File Upload | Multer |
| UI | Bootstrap 5 |

---

## Project Structure

```
blog-app/
├── app.js                  # Entry point
├── .env                    # Environment variables
├── config/
│   └── multer.js           # File upload config
├── middleware/
│   └── auth.js             # JWT auth middleware
├── models/
│   ├── User.js             # User schema
│   └── Blog.js             # Blog + Comment + Reply schemas
├── routes/
│   ├── auth.js             # /signup, /login, /logout
│   ├── dashboard.js        # /dashboard
│   ├── blogs.js            # /blogs (CRUD)
│   └── comments.js         # /comments (add, reply)
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── auth/
│   │   ├── signup.ejs
│   │   └── login.ejs
│   ├── dashboard/
│   │   └── index.ejs
│   └── blogs/
│       ├── form.ejs        # Create + Edit form
│       └── view.ejs        # Full blog + comments
└── uploads/                # Uploaded images (auto-created)
```

---

## Setup & Run

### Prerequisites
- Node.js v14+
- MongoDB running locally (or provide Atlas URI)

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
# Edit .env file:
MONGO_URI=mongodb://localhost:27017/blogapp
JWT_SECRET=your_jwt_secret_key_here
SESSION_SECRET=your_session_secret_here
PORT=3000

# 3. Start the server
npm start

# 4. Visit http://localhost:3000
```

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/signup` | Signup page |
| POST | `/signup` | Register user |
| GET | `/login` | Login page |
| POST | `/login` | Authenticate + JWT |
| GET | `/logout` | Destroy session |
| GET | `/dashboard` | User dashboard 🔒 |
| GET | `/blogs/new` | New blog form 🔒 |
| POST | `/blogs` | Create blog 🔒 |
| GET | `/blogs/:id` | View blog 🔒 |
| GET | `/blogs/:id/edit` | Edit form 🔒 |
| POST | `/blogs/:id?_method=PUT` | Update blog 🔒 |
| POST | `/blogs/:id/delete` | Delete blog 🔒 |
| POST | `/comments/:blogId` | Add comment 🔒 |
| POST | `/comments/:blogId/:commentId/reply` | Reply to comment 🔒 |

🔒 = Requires authentication
