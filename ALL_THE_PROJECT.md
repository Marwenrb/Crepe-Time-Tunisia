# 🥞 Crêpe Time Tunisia — ALL THE PROJECT

> **The Absolute Source of Truth** for the Crêpe Time Tunisia food ordering platform.
> Last updated: 2026-03-27

---

## 1. Project Architecture

```
crepe-time-tunisia/
├── food-ordering-frontend/    ← Vite + React 18 + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── pages/             ← Route pages (lazy-loaded)
│   │   ├── components/        ← Reusable UI components
│   │   ├── contexts/          ← React contexts (Auth, App)
│   │   ├── auth/              ← ProtectedRoute, AdminRoute guards
│   │   ├── api/               ← API client helpers (Axios)
│   │   ├── layouts/           ← Layout wrapper with hero
│   │   └── AppRoutes.tsx      ← All routes with React.lazy()
│   ├── public/                ← Static assets, favicon, robots.txt, sitemap.xml
│   ├── netlify.toml           ← Netlify build + redirects + security headers
│   └── .env.production        ← Production env template
│
├── food-ordering-backend/     ← Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/       ← Route handlers
│   │   ├── routes/            ← Express routers
│   │   ├── middleware/        ← Auth, validation, error handling
│   │   ├── services/          ← WhatsApp notification service
│   │   ├── lib/               ← Supabase client, Cloudinary config
│   │   └── index.ts           ← Server entry point
│   ├── scripts/               ← seed-restaurant.ts, check-supabase-connection.ts
│   └── render.yaml            ← Render.com blueprint
│
├── supabase/
│   ├── migrations/            ← SQL migration files
│   └── functions/             ← Edge Functions (notify-client via Resend)
│
├── package.json               ← Root monorepo scripts (concurrently)
└── ALL_THE_PROJECT.md          ← ← YOU ARE HERE
```

**Stack Summary:**
| Layer      | Technology                              | Host      |
|------------|-----------------------------------------|-----------|
| Frontend   | Vite 7 · React 18 · TypeScript · Tailwind 3 | Netlify   |
| Backend    | Node.js · Express · TypeScript          | Render    |
| Database   | Supabase (PostgreSQL + Auth + Storage)  | Supabase  |
| Images     | Cloudinary                              | Cloudinary|
| Notifications | WhatsApp Business API + Resend (email) | Meta / Resend |

---

## 2. Step-by-Step Usage Guide

### 2.1 Prerequisites

- **Node.js** ≥ 18
- **npm** (comes with Node)
- A **Supabase** project (free tier works)
- **Cloudinary** account (free tier)

### 2.2 Local Development

```bash
# 1. Clone & install
git clone <repo-url>
cd Restaurant-Food-Ordering-Management-System--React-MERN-FullStack-main

# 2. Install root dependencies (concurrently)
npm install

# 3. Install frontend dependencies
cd food-ordering-frontend && npm install && cd ..

# 4. Install backend dependencies
cd food-ordering-backend && npm install && cd ..

# 5. Configure environment
cp food-ordering-frontend/.env.example food-ordering-frontend/.env
cp food-ordering-backend/.env.example  food-ordering-backend/.env
# Edit both .env files with your real credentials

# 6. Start both servers (concurrent)
npm run dev
# Frontend → http://localhost:5173
# Backend  → http://localhost:5000
```

### 2.3 Database Seeding

```bash
# Seeds the Supabase database with the Crêpe Time restaurant,
# menu items, and categories
npm run seed
```

This runs `food-ordering-backend/scripts/seed-restaurant.ts` which:
1. Connects to Supabase using `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
2. Creates the restaurant record (name, address, city, delivery info)
3. Inserts menu items with Cloudinary image URLs
4. Sets up categories (Crêpes Sucrées, Crêpes Salées, Boissons, etc.)

### 2.4 WhatsApp Notification Flow

**Two channels fire on every order:**

| Channel | How it works | Requirement |
|---------|-------------|-------------|
| **Channel A** — Meta Business API | Backend calls Meta Graph API → sends order details to restaurant WhatsApp + confirmation to customer | `WHATSAPP_API_TOKEN` + `WHATSAPP_API_PHONE_ID` in backend `.env` |
| **Channel B** — wa.me deep-link | Frontend opens `wa.me/+216...?text=...` as fallback | Always works, no config needed |

**Setup:** Follow the detailed 8-step guide in `food-ordering-backend/.env.example`.

### 2.5 Resend (Email) Notification Flow

- A Supabase **Edge Function** (`supabase/functions/notify-client`) sends email confirmations via [Resend](https://resend.com).
- The API key is set as a Supabase secret: `supabase secrets set RESEND_API_KEY=re_your_key`
- This function is triggered after order creation.

---

## 3. Deployment Cheat Sheet

### 3.1 Frontend → Netlify

```bash
# Option A: Netlify CLI
cd food-ordering-frontend
npx netlify-cli deploy --prod --dir=dist

# Option B: Git-based deploys (recommended)
# 1. Connect repo to Netlify
# 2. Set Base directory: food-ordering-frontend
# 3. Build command: npm run build
# 4. Publish directory: food-ordering-frontend/dist
# 5. Set env vars in Netlify UI:
#    VITE_API_BASE_URL = https://crepe-time-tunisia.onrender.com
#    VITE_SUPABASE_URL = https://kjhuwmbddxuyrtycdezr.supabase.co
#    VITE_SUPABASE_ANON_KEY = <your anon key>
#    VITE_APP_URL = https://crepetime.tn
```

**Custom Domain:** In Netlify > Domain settings > add `crepetime.tn` and configure DNS.

### 3.2 Backend → Render

```bash
# Option A: render.yaml blueprint
# Push to GitHub → Render auto-detects render.yaml

# Option B: Manual
# 1. Create a Web Service on render.com
# 2. Root Directory: food-ordering-backend
# 3. Build Command: npm install && npm run build
# 4. Start Command: npm start
# 5. Set all env vars from food-ordering-backend/.env.example
# 6. Region: Frankfurt (eu-central)
```

### 3.3 Supabase Edge Functions

```bash
# Link project
supabase link --project-ref kjhuwmbddxuyrtycdezr

# Set secrets
supabase secrets set RESEND_API_KEY=re_your_key
supabase secrets set FRONTEND_URL=https://crepetime.tn

# Deploy
supabase functions deploy notify-client

# Push DB migrations
supabase db push --linked
```

### 3.4 Quick Update Workflow

```bash
# After code changes:
git add -A && git commit -m "feat: description"
git push origin main
# Netlify & Render auto-deploy from GitHub
```

---

## 4. Master Credentials Vault

> ⚠️ **SENSITIVE** — Do not share this file publicly.

### 4.1 Application Logins

| Role         | Email                  | Password         |
|--------------|------------------------|------------------|
| **Admin**    | admin@crepetime.tn     | CrepeTime2026!   |
| **Test User**| test@user.com          | 12345678         |

### 4.2 Production URLs

| Service    | URL                                        |
|------------|--------------------------------------------|
| Frontend   | https://crepetime.tn                       |
| Backend API| https://crepe-time-tunisia.onrender.com     |
| Supabase   | https://kjhuwmbddxuyrtycdezr.supabase.co   |

### 4.3 API Key Locations

| Service      | Where to find / set                                    |
|--------------|--------------------------------------------------------|
| Supabase Anon Key | Supabase Dashboard → Settings → API → `anon` key |
| Supabase Service Role | Supabase Dashboard → Settings → API → `service_role` key |
| Cloudinary   | `food-ordering-backend/.env` → `CLOUDINARY_*` vars    |
| WhatsApp API | `food-ordering-backend/.env` → `WHATSAPP_API_TOKEN` + `WHATSAPP_API_PHONE_ID` |
| Resend       | Supabase secret: `RESEND_API_KEY` (set via CLI)        |
| Google OAuth | Supabase Dashboard → Authentication → Providers → Google |
| JWT Secret   | `food-ordering-backend/.env` → `JWT_SECRET_KEY`        |

### 4.4 Restaurant WhatsApp

- **Phone:** +216 25 799 066
- **Format:** E.164 (`+21625799066`)

---

*Generated for the Crêpe Time Tunisia project. Keep this file updated after every major change.*
