# MandiConnect

MandiConnect is a farm-to-retail marketplace developed as a Minimum Viable Product (MVP), featuring both a website and a Progressive Web Application (PWA).

> Built as a Hackathon Project by a team of 4
> Aditya, Rishabh, Sammed K and Sammed B

---

## Concept

The platform bridges the gap between rural farmers and retailers by offering an accessible, low-bandwidth, and offline-first solution. Its primary goal is to empower farmers — including those with limited technical experience — to effectively reach potential buyers and streamline their sales process.

---

## Features

### Core Platform Features
- **Role-Based Access** — Separate dashboards and flows for Farmers, Buyers, and Delivery Partners.
- **Farmer Dashboard** — Dedicated hub for farmers to manage their listings and activity.
- **Buyer Marketplace** — Buyers can browse and discover fresh produce tailored to their needs.
- **Delivery Partner Dashboard** — Logistics view for delivery partners to track and manage active orders.

### Product Management
- **Easy Product Listing** — Farmers can list agricultural products with name, category, quantity, unit, price, location, and description.
- **Product Image Upload** — Upload product photos (PNG/JPG up to 5MB) with live preview before submission.
- **Product Categories** — Supports Vegetables, Fruits, Grains, Pulses, Dairy, and more.
- **Live Product Feed** — Landing page displays all available farmer listings fetched in real time from the backend.
- **Product Status Tracking** — Products can be marked as available, sold, or unavailable.
- **Agricultural Supply Catalog** — Browse categories like Crop Care & Protection, Heavy Machinery, Irrigation & Water Management, Storage & Post-Harvest, and Livestock & Hand Tools.

### Authentication
- **Phone OTP Login** — Firebase-powered phone number authentication with invisible reCAPTCHA.
- **Google Sign-In** — One-click sign-in via Google OAuth using Firebase.
- **Role Selection at Login** — Users select their role (Farmer / Buyer / Delivery Partner) during authentication, which routes them to the correct dashboard.

### Payments & Transactions
- **UPI Payments Integration** — Secure, quick, and accessible payment processing via UPI, tailored for rural India.
- **Direct Orders** — Retailers place bulk orders directly from farmers, eliminating unpredictable middlemen.

### Connectivity & Accessibility
- **Offline First (PWA)** — List your harvest even without internet. Data syncs automatically when back online.
- **Low Bandwidth Optimized** — Designed for rural areas with limited connectivity.
- **Multilingual Translation** — Platform supports multiple languages to serve farmers across different regions of India.
- **Price Transparency** — Fair pricing through better market visibility and reduction of intermediaries.

### Backend & Infrastructure
- **Node.js + Express REST API** — Full backend with endpoints for creating, reading, updating, and deleting products.
- **MongoDB Atlas** — Cloud database for persistent product storage.
- **Image Storage** — Uploaded product images are stored server-side and served statically.
- **Health Check Endpoint** — `/api/health` for monitoring server and database status.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite), React Router |
| Auth | Firebase (Phone OTP, Google OAuth) |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| File Uploads | Multer |
| Styling | CSS (custom, per-page) |
| PWA | Progressive Web App support |

---

## Getting Started

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

> Make sure to configure your `.env` file in the `backend/` directory with your MongoDB URI and other environment variables.

---

## Team

| Name | Role |
|------|------|
| Aditya | Team Member |
| Rishabh | Team Member |
| Sammed K | Team Member |
| Sammed B | Team Member |

---

© 2026 MandiConnect. Empowering roots.
