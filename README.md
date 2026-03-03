# 🧇 Crêpe Time Tunisia

[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.x-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

### *The Sweetest Escape*

> Plateforme premium de commande de crêpes artisanales — Full-Stack React + Node + Supabase  
> Livraison à domicile & retrait en boutique | Notification WhatsApp | Google OAuth

**Repository:** [github.com/Marwenrb/Crepe-Time-Tunisia](https://github.com/Marwenrb/Crepe-Time-Tunisia)  
**Contact:** rbmarwenrb@gmail.com

---

## Aperçu

**Crêpe Time Tunisia** est une application web complète de commande de crêpes artisanales pour Nabeul. Les clients parcourent le menu, ajoutent au panier, passent commande (paiement à la livraison), et suivent l'état en temps réel. Le restaurant reçoit chaque commande via WhatsApp.

### Fonctionnalités

- **Menu interactif** — 12 crêpes artisanales avec descriptions et prix TND
- **Panier dynamique** — Ajout, suppression, modification des quantités
- **Commande simplifiée** — Paiement à la livraison ou retrait en boutique
- **Notification WhatsApp** — Message automatique au restaurant
- **Suivi de commande** — Statuts en temps réel
- **Panel admin** — Gestion restaurant, menu, statuts
- **Tableau de bord analytique** — Statistiques de ventes
- **Authentification** — Email + Google OAuth (Supabase Auth)
- **Upload d'images** — Cloudinary
- **Design responsive** — Interface premium purple/gold

---

## Stack technique

| Couche | Technologies |
|--------|-------------|
| **Frontend** | React 18, TypeScript, Vite 7, Tailwind CSS, Shadcn/ui |
| **Backend** | Node.js, Express, TypeScript |
| **Base de données** | Supabase (PostgreSQL) |
| **Authentification** | Supabase Auth (email + Google OAuth) |
| **Images** | Cloudinary |
| **Notifications** | WhatsApp (wa.me) |
| **Sécurité** | Helmet, CORS, express-rate-limit |

---

## Démarrage rapide

### Une commande (recommandé)

```bash
npm run dev
```

> Lance backend (port 5000) et frontend (port 5173) en parallèle.

### Prérequis

- **Node.js** v18+ et **npm** v9+
- **Compte Supabase** (gratuit) — [supabase.com](https://supabase.com)
- **Cloudinary** (gratuit) — pour l'upload d'images
- **Google Cloud** (optionnel) — pour OAuth Google

### Configuration

1. **Cloner** le projet
2. **Supabase** : Créer un projet, exécuter les migrations SQL dans l'ordre : `001_initial_schema.sql`, `002_supabase_auth.sql`, `003_realtime_and_email_logs.sql`
3. **Backend** : Copier `food-ordering-backend/.env.example` → `.env`, remplir les variables
4. **Frontend** : Copier `food-ordering-frontend/.env.example` → `.env`, remplir les variables
5. **Seed** (une fois) : `npm run seed`
6. **Démarrer** : `npm run dev`

Ouvrir **http://localhost:5173**

> Identifiants admin : voir [CREDENTIALS.md](./CREDENTIALS.md)

---

## Structure du projet

```
crepe-time-tunisia/
├── food-ordering-backend/     # API Node.js + Express + Supabase
│   ├── src/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── services/
│   ├── scripts/
│   │   └── seed-restaurant.ts
│   └── .env.example
├── food-ordering-frontend/    # React + Vite + Tailwind
│   ├── src/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── components/
│   │   ├── config/
│   │   ├── contexts/
│   │   ├── forms/
│   │   ├── layouts/
│   │   ├── lib/
│   │   └── pages/
│   └── .env.example
├── supabase/
│   └── migrations/
├── GUIDE_DEMARRAGE.md
├── DEVELOPER_GUIDE.md
├── DEPLOYMENT_QUICKSTART.md
├── GOOGLE_OAUTH_SETUP.md
├── CREDENTIALS.md
└── README.md
```

---

## Déploiement

| Plateforme | Frontend | Backend |
|------------|----------|---------|
| **Vercel** | ✅ | — |
| **Render** | — | ✅ |
| **Coolify** | ✅ | ✅ |

### Frontend (Vercel)

- Root Directory : `food-ordering-frontend`
- Build : `npm run build`
- Output : `dist`
- Variables : `VITE_API_BASE_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

### Backend (Render)

- Root Directory : `food-ordering-backend`
- Build : `npm install && npm run build`
- Start : `npm start`
- Variables : `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET_KEY`, `FRONTEND_URL`, etc.

Voir [DEPLOYMENT_QUICKSTART.md](./DEPLOYMENT_QUICKSTART.md) pour les détails.

---

## Documentation

| Fichier | Description |
|---------|-------------|
| [GUIDE_DEMARRAGE.md](./GUIDE_DEMARRAGE.md) | Guide complet de démarrage |
| [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) | Architecture et conventions |
| [DEPLOYMENT_QUICKSTART.md](./DEPLOYMENT_QUICKSTART.md) | Déploiement Vercel + Render |
| [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) | Configuration Google OAuth |
| [NOTIFICATIONS_SETUP.md](./NOTIFICATIONS_SETUP.md) | Realtime + Resend emails |
| [CREDENTIALS.md](./CREDENTIALS.md) | Comptes de test (seed) |

---

## Auteurs & Contact

- **Crêpe Time Tunisia** — [GitHub](https://github.com/Marwenrb/Crepe-Time-Tunisia)
- **Email:** rbmarwenrb@gmail.com

---

## Licence

[MIT](LICENSE)
