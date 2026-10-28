# 🌾 AgriTech - Smart Farming Platform

A full-stack agricultural technology web application built with React + Vite (frontend) and Node.js + Express + MongoDB (backend).

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

New accounts require a name, unique enrollment number, email address, and password.
Enrollment numbers are stored uppercase and included in the authenticated user profile.

### 1. Server Setup

```bash
cd Server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### 2. Client Setup

```bash
cd Client
npm run dev
```

### URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

---

## ⚙️ Environment Variables (Server/.env)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret for JWT tokens (change in production!) |
| `PORT` | No | Server port (default: 5000) |
| `CLIENT_URL` | No | Frontend URL for CORS (default: http://localhost:5173) |
| `OPENWEATHER_API_KEY` | No | Free key from [openweathermap.org](https://openweathermap.org/api) |

---

## 🗃️ Database Setup

**Local MongoDB:**
```
MONGO_URI=mongodb://localhost:27017/agritech
```

**MongoDB Atlas:**
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/agritech
```

> If `MONGO_URI` is not set, the server runs without database persistence (UI demo mode only).

---

## 👤 Creating the First Admin

1. Register a normal user through the app.
2. Open MongoDB shell or Compass.
3. Run: `db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })`
4. Log in again — you'll now see the Admin Panel.

---

## 📋 Features

### User Features
- 🔐 Register/Login with JWT authentication
- 🏡 Manage Farms (add, view, delete)
- 🌱 Track Crops (add with growth stages, farm association)
- 🛒 Browse & Order Products
- 📦 View Order History & Status
- 🌤️ Weather Forecast by city/location
- 📚 Crop Information Guide

### Admin Features
- 📊 Dashboard with stats (users, products, orders, revenue)
- 👥 User Management (view, promote/demote admin role)
- 📦 Product Management (create, edit, delete)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Bootstrap 5, React-Bootstrap, Custom CSS |
| Icons | React Icons |
| HTTP Client | Axios |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Weather | OpenWeatherMap API (proxied) |

---

## 📁 Project Structure

```
AgriTech/
├── Client/               # React + Vite frontend
│   └── src/
│       ├── components/   # Navbar, Footer, Sidebar, Guards
│       ├── context/      # Auth context
│       ├── pages/        # All page components
│       │   └── admin/    # Admin pages
│       └── services/     # Axios API service
└── Server/               # Node.js + Express backend
    ├── config/           # Database connection
    ├── controllers/      # Business logic
    ├── middleware/        # Auth guards
    ├── models/           # Mongoose schemas
    └── routes/           # API endpoints
```
