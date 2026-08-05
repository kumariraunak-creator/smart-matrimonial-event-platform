# 💍 Smart Matrimonial & Event Service Platform (UnityMatrimony Hub)

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-f43f5e?style=for-the-badge&logo=mongodb)](https://github.com/kumariraunak-creator)
[![React](https://img.shields.io/badge/Frontend-React.js%20(Vite)-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-blue.style=for-the-badge)](LICENSE)

A full-stack **MERN** web application developed as a **Main DBMS Final Project** to modernize traditional matrimonial systems through a secure, scalable, and database-driven platform.

Developed by **[kumariraunak-creator](https://github.com/kumariraunak-creator)**.

---

## 🌟 Key Features

1. **🔐 Secure Authentication & Access Approval Flow**:
   - JWT-based authentication with `bcrypt.js` password encryption.
   - **Restricted Access Queue**: New user signups enter a `pending_approval` status requiring **Admin verification** before gaining platform access.
2. **💖 Matrimonial Match Engine**:
   - Dynamic 0–99% compatibility score computation evaluating age ranges, religion, income thresholds, and location proximity.
   - Multi-attribute filter & candidate profile search.
   - User profile picture upload / avatar URL editing with circular live previews.
3. **💐 Event Vendor & Consultant Directory**:
   - Directory across 5 distinct categories: **Decorators, Caterers, Photographers, Lawyers, and Venues**.
   - Guest count sliders, service package selection, and live cost calculation.
4. **📅 Multi-Stage Booking Lifecycle**:
   - Complete event booking tracker supporting `pending` $\rightarrow$ `confirmed` $\rightarrow$ `completed` $\rightarrow$ `cancelled` workflow transitions.
5. **🛡️ Admin Management & Aggregation Analytics**:
   - **Access Request Approval Queue**: 1-click `Approve Access` or `Reject Access` for pending user signups.
   - **Vendor Verification Queue**: Approve or revoke vendor business applications.
   - **MongoDB Aggregation Analytics**: Live revenue distribution (`$lookup`, `$group`, `$unwind`), demographic statistics, and top-rated vendor rankings.
6. **💚 Live MongoDB Inspector Console**:
   - In-app live MongoDB document browser for all 7 collections (`Users`, `Profiles`, `Vendors`, `Bookings`, `Reviews`, `Messages`, `Notifications`).
   - Schema Entity-Relationship Map viewer.
   - Interactive JSON Query execution terminal.

---

## 📁 Project Folder Structure

```
matrimonial-event-platform/
├── backend/
│   ├── config/
│   │   └── db.js                 # Primary MongoDB Atlas & Embedded Database Engine
│   ├── middleware/
│   │   └── auth.js               # JWT Auth & Role-Based Access Control (RBAC)
│   ├── models/
│   │   ├── User.js               # Users (Candidates, Vendors, Admins)
│   │   ├── Profile.js            # Matrimonial Profiles & Partner Criteria
│   │   ├── Vendor.js             # Decorators, Caterers, Photographers, Lawyers, Venues
│   │   ├── Booking.js            # Event Bookings & Status Workflow
│   │   ├── Review.js             # Ratings, Comments & Post-Save Rating Hook
│   │   ├── Message.js            # Direct Chat & Inquiries
│   │   └── Notification.js       # Activity Notifications
│   ├── routes/
│   │   ├── adminRoutes.js        # Admin metrics, vendor verification, DB Explorer APIs
│   │   ├── authRoutes.js         # Register, Login, Me, Demo Switcher
│   │   ├── bookingRoutes.js      # Booking CRUD & Status Updates
│   │   ├── messageRoutes.js      # Direct Messaging APIs
│   │   ├── profileRoutes.js      # Matrimonial Profiles & AI Match Calculation
│   │   ├── reviewRoutes.js       # Reviews CRUD
│   │   └── vendorRoutes.js       # Vendor Directory CRUD
│   ├── seed/
│   │   └── seedData.js           # Seeds 10+ records across all 7 collections
│   ├── .env.example              # Environment variables template
│   ├── package.json
│   └── server.js                 # Express server entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Admin/AdminDashboard.jsx           # Access requests & aggregation analytics
    │   │   ├── Bookings/BookingsList.jsx         # Booking status tracker
    │   │   ├── Communication/ChatDrawer.jsx       # Direct messaging panel
    │   │   ├── Communication/NotificationsModal.jsx # Activity alerts
    │   │   ├── DatabaseInspector/DatabaseInspectorModal.jsx # MongoDB ER & Query Inspector
    │   │   ├── Matrimonial/MatrimonialList.jsx   # Matches directory & compatibility score
    │   │   ├── Matrimonial/MyProfileEditor.jsx   # Profile & avatar editor
    │   │   ├── Matrimonial/ProfileModal.jsx      # Profile details & express interest
    │   │   ├── Vendors/BookingModal.jsx          # Event booking calculator
    │   │   ├── Vendors/VendorDetailModal.jsx     # Vendor packages & review submission
    │   │   ├── Vendors/VendorList.jsx            # Vendor directory across 5 categories
    │   │   ├── Hero.jsx                          # Main banner
    │   │   └── Navbar.jsx                        # Header, DB inspector & persona switcher
    │   ├── context/AuthContext.jsx               # Auth state & quick persona switcher
    │   ├── App.jsx                               # Main application layout
    │   ├── index.css                             # Glassmorphism UI design system
    │   └── main.jsx                              # React entry point
    ├── index.html
    ├── package.json
    └── vite.config.js                            # Vite dev server & API proxy
```

---

## ⚡ Quick Start Guide (Local Execution)

### 1. Prerequisites
- Node.js (v18+)
- Git installed on your system

### 2. Clone Repository & Install Dependencies
```bash
git clone https://github.com/kumariraunak-creator/smart-matrimonial-platform.git
cd smart-matrimonial-platform
```

#### Install Backend Dependencies:
```bash
cd backend
npm install
```

#### Install Frontend Dependencies:
```bash
cd ../frontend
npm install
```

### 3. Configure Environment Variables
Create a `.env` file inside the `backend` folder:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/matrimonial_db?retryWrites=true&w=majority
JWT_SECRET=super_secret_matrimonial_jwt_key_2026
```

### 4. Run the Servers

#### Start Backend API Server:
```bash
cd backend
npm start
```
*Runs on `http://localhost:5000`*

#### Start Frontend Dev Server:
```bash
cd frontend
npm run dev
```
*Runs on `http://localhost:3000`*

---

## 🚀 Deployment Instructions

- **Frontend**: Deploy to **Vercel** (`npm run build`, root `frontend`)
- **Backend**: Deploy to **Render** (`npm start`, root `backend`)
- **Database**: Cloud instance on **MongoDB Atlas**

---

## 👨‍💻 Author

Developed by **[kumariraunak-creator](https://github.com/kumariraunak-creator)** for Main DBMS Final Project Submission.

If you find this repository helpful, please consider giving it a ⭐!
