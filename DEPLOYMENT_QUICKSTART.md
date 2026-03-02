# Déploiement rapide — Vercel + Render

## Prérequis

- Compte [Vercel](https://vercel.com)
- Compte [Render](https://render.com)
- Projet Supabase (gratuit)

---

## 1. Backend sur Render

1. Crée un **Web Service** sur Render
2. Connecte ton repo GitHub
3. **Root Directory** : `food-ordering-backend`
4. **Build Command** : `npm install && npm run build`
5. **Start Command** : `npm start`
6. **Variables d'environnement** :

| Variable | Valeur |
|----------|--------|
| `SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service role (Supabase Settings > API) |
| `JWT_SECRET_KEY` | Chaîne longue aléatoire (ex: `openssl rand -hex 32`) |
| `FRONTEND_URL` | `https://ton-app.vercel.app` (ton URL Vercel) |
| `BACKEND_URL` | `https://ton-api.onrender.com` |
| `WHATSAPP_RESTAURANT_PHONE` | `+216XXXXXXXX` |
| `CLOUDINARY_CLOUD_NAME` | (optionnel) |
| `CLOUDINARY_API_KEY` | (optionnel) |
| `CLOUDINARY_API_SECRET` | (optionnel) |

7. Déploie. Note l'URL du backend (ex: `https://xxx.onrender.com`)

---

## 2. Frontend sur Vercel

1. Crée un projet sur [vercel.com](https://vercel.com) → Import Git Repository
2. **Root Directory** : `food-ordering-frontend`
3. **Framework Preset** : Vite
4. **Build Command** : `npm run build`
5. **Output Directory** : `dist`
6. **Variables d'environnement** :

| Variable | Valeur |
|----------|--------|
| `VITE_API_BASE_URL` | `https://ton-api.onrender.com` (URL Render backend) |
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Clé anon (Supabase Settings > API) |

7. Déploie

---

## 3. CORS et URLs

Dans `food-ordering-backend` sur Render, ajoute l'URL Vercel :

```
FRONTEND_URL=https://ton-app.vercel.app
```

---

## 4. Seed en production

Après le premier déploiement, exécute le seed une fois en local avec les variables de production :

```bash
cd food-ordering-backend
SUPABASE_URL="https://xxx.supabase.co" SUPABASE_SERVICE_ROLE_KEY="eyJ..." npm run seed
```

Ou exécute le schéma SQL et le seed manuellement via Supabase SQL Editor.

---

## 5. Capacitor (PWA / Play Store)

```bash
cd food-ordering-frontend
npm install @capacitor/core @capacitor/cli
npx cap init "Crêpe Time Tunisia" tn.crepetime.app
npm run build
npx cap add android
npx cap add ios
npx cap sync
npx cap open android   # ou: npx cap open ios
```
