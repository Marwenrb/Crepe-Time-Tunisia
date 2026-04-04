<p align="center">
  <img src="food-ordering-frontend/public/crepe-time-logo.png" width="120" alt="Crêpe Time" />
</p>

<h1 align="center">Crêpe Time Tunisia</h1>

<p align="center">
  <strong>Full-stack artisan crêpe ordering platform — React · Express · Supabase</strong>
</p>

<p align="center">
  <a href="https://crepetime.tn">crepetime.tn</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
</p>

---

## Overview

Production-grade food ordering system built for **Crêpe Time**, an artisan crêperie in Nabeul, Tunisia. Customers browse the menu, build a cart, place orders (cash on delivery), and track status in real time. The restaurant receives instant WhatsApp notifications for every order.

**Live:** [crepetime.tn](https://crepetime.tn)

## Features

- **Interactive menu** — categorized items with modal detail view, quantity controls, dynamic cart
- **Dual checkout** — authenticated users & guest ordering (no account required)
- **Real-time order tracking** — live status updates via Supabase Realtime
- **WhatsApp notifications** — automatic order alerts to the restaurant
- **Admin dashboard** — restaurant management, menu editor, order status control, business analytics
- **Google OAuth + email auth** — Supabase Auth with implicit flow
- **Image uploads** — Cloudinary integration for menu item & restaurant photos
- **Responsive design** — premium dark purple/gold theme, mobile-first

## Architecture

```
┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
│   React SPA      │  API   │   Express API    │  SQL   │   Supabase       │
│   Netlify        │◄──────►│   Render         │◄──────►│   PostgreSQL     │
│   crepetime.tn   │  HTTPS │   onrender.com   │        │   Auth · Storage │
└──────────────────┘        └──────────────────┘        └──────────────────┘
                                     │
                              ┌──────┴──────┐
                              │  Cloudinary  │
                              │  WhatsApp    │
                              └─────────────┘
```

| Layer | Stack |
|-------|-------|
| **Frontend** | React 18, TypeScript, Vite 7, Tailwind CSS, Radix UI, Framer Motion, React Query |
| **Backend** | Node.js, Express 4, TypeScript, Helmet, CORS, express-rate-limit |
| **Database** | Supabase (PostgreSQL), Row Level Security, Realtime subscriptions |
| **Auth** | Supabase Auth — email/password + Google OAuth (implicit flow) |
| **Storage** | Cloudinary (images), Supabase Storage |
| **Notifications** | WhatsApp Business API + wa.me deep links |

## Project Structure

```
crepe-time-tunisia/
├── food-ordering-frontend/          # React + Vite + Tailwind SPA
│   ├── src/
│   │   ├── api/                     # API hooks (react-query)
│   │   ├── auth/                    # Route guards (ProtectedRoute, AdminRoute)
│   │   ├── components/              # UI components + home sections
│   │   ├── config/                  # Brand, menu categories, images
│   │   ├── contexts/                # Auth state (AppContext)
│   │   ├── forms/                   # Checkout, restaurant, profile forms
│   │   ├── lib/                     # API client, Supabase, runtime config
│   │   └── pages/                   # Route pages
│   ├── public/                      # Static assets, PWA manifest, SEO
│   ├── netlify.toml                 # Build + SPA redirect + security headers
│   └── vite.config.ts               # Build config, chunk splitting
│
├── food-ordering-backend/           # Express + TypeScript API
│   ├── src/
│   │   ├── controllers/             # Business logic
│   │   ├── lib/                     # Supabase client, transforms
│   │   ├── middleware/              # Auth, admin guard, validation
│   │   ├── routes/                  # REST endpoints
│   │   └── services/                # WhatsApp notifications
│   ├── scripts/                     # DB seed, connection check
│   └── render.yaml                  # Render blueprint
│
└── supabase/
    ├── migrations/                  # SQL schema (4 migrations)
    └── functions/                   # Edge functions
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- [Supabase](https://supabase.com) project (free tier)
- [Cloudinary](https://cloudinary.com) account (free tier)
- Google Cloud Console (optional — for OAuth)

### Setup

```bash
# Clone
git clone https://github.com/Marwenrb/Crepe-Time-Tunisia.git
cd Crepe-Time-Tunisia

# Configure environment
cp food-ordering-backend/.env.example food-ordering-backend/.env
cp food-ordering-frontend/.env.example food-ordering-frontend/.env
# Edit both .env files with your credentials

# Run Supabase migrations (in order)
# 001_initial_schema.sql → 002_supabase_auth.sql → 003_realtime_and_email_logs.sql

# Seed the database
npm run seed

# Start development (backend + frontend)
npm run dev
```

Frontend: `http://localhost:5173` — Backend: `http://localhost:5000`

## Deployment

| Service | Platform | Root Directory | Build | Start |
|---------|----------|---------------|-------|-------|
| **Frontend** | Netlify | `food-ordering-frontend` | `npm run build` | Static (`dist/`) |
| **Backend** | Render | `food-ordering-backend` | `npm install && npm run build` | `npm start` |

### Environment Variables

**Frontend** (Netlify):
- `VITE_API_BASE_URL` — backend URL
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/publishable key
- `VITE_RESTAURANT_ID` — restaurant UUID

**Backend** (Render):
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — Supabase connection
- `JWT_SECRET_KEY` — token signing
- `FRONTEND_URL` — allowed CORS origins (comma-separated)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `WHATSAPP_RESTAURANT_PHONE` — restaurant notification number

## API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/restaurant/:id` | Public | Get restaurant by ID |
| `GET` | `/api/restaurant/search/:city` | Public | Search restaurants |
| `POST` | `/api/order/create` | User | Create authenticated order |
| `POST` | `/api/order/create-guest` | Public | Create guest order |
| `GET` | `/api/order/track/:orderId` | Public | Track order status |
| `GET` | `/api/auth/validate-token` | User | Validate session |
| `GET/POST/PUT` | `/api/my/user` | User | User profile CRUD |
| `GET/POST/PUT` | `/api/my/restaurant` | Admin | Restaurant management |
| `PATCH` | `/api/my/restaurant/order/:id/status` | Admin | Update order status |
| `GET` | `/api/business-insights` | Admin | Analytics dashboard |
| `GET` | `/health` | Public | Health check |

## License

[MIT](LICENSE) — Marouan Rabai
