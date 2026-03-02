# Guide de démarrage — Crêpe Time Tunisia

> **Guide complet pour tout développeur qui rejoint le projet.**  
> Par où commencer, quels comptes créer, quelles commandes exécuter, quels liens utiliser.

---

## Table des matières

1. [Prérequis](#1-prérequis)
2. [Par où commencer](#2-par-où-commencer)
3. [Configuration Supabase](#3-configuration-supabase)
4. [Configuration des fichiers .env](#4-configuration-des-fichiers-env)
5. [Commandes à exécuter (dans l'ordre)](#5-commandes-à-exécuter-dans-lordre)
6. [Liens disponibles et comment y accéder](#6-liens-disponibles-et-comment-y-accéder)
7. [Modifications de code courantes](#7-modifications-de-code-courantes)
8. [Dépannage](#8-dépannage)

---

## 1. Prérequis

| Outil | Version | Vérification |
|-------|---------|---------------|
| **Node.js** | 18+ | `node -v` |
| **npm** | 9+ | `npm -v` |
| **Compte Supabase** | Gratuit | [supabase.com](https://supabase.com) |

---

## 2. Par où commencer

### Ordre recommandé

1. **Cloner le projet** (si pas déjà fait)
2. **Supabase** : Créer un projet et exécuter le schéma SQL
3. **Configurer les fichiers `.env`** (backend + frontend)
4. **Installer les dépendances** (backend + frontend)
5. **Lancer le seed** pour créer l'admin et le restaurant
6. **Démarrer backend et frontend**
7. **Se connecter en admin** et vérifier le menu

---

## 3. Configuration Supabase

### Créer un projet Supabase

1. Aller sur [supabase.com](https://supabase.com) et créer un compte
2. Créer un **nouveau projet** (choisir une région proche)
3. Noter le **Project URL** et la **API Key** (Settings > API)

### Exécuter le schéma SQL

1. Dans le dashboard Supabase, aller dans **SQL Editor**
2. Créer une nouvelle requête
3. Exécuter `001_initial_schema.sql` puis `002_supabase_auth.sql`
4. Vérifier : `Success. No rows returned`

### Récupérer les clés API

- **Project URL** : `https://xxxxx.supabase.co`
- **Service Role Key** (Settings > API > Service role) : pour le backend (bypass RLS)
- **Anon Key** : optionnel, pour accès client direct

### Comptes optionnels (à configurer plus tard)

| Service | Usage | Obligatoire |
|---------|-------|-------------|
| **Cloudinary** | Images du restaurant / menu | Non (images par défaut) |
| **Google OAuth** | Connexion avec Google | Non |
| **WhatsApp Business API** | Notifications automatiques | Non (lien wa.me utilisé par défaut) |

---

## 4. Configuration des fichiers .env

### Backend : `food-ordering-backend/.env`

Créer le fichier à partir de `.env.example` :

```bash
cd food-ordering-backend
copy .env.example .env
```

Puis modifier `.env` :

```env
# Supabase — OBLIGATOIRE
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key

# JWT — OBLIGATOIRE (changer en production)
JWT_SECRET_KEY=CrepeTime2026SecureJWTSecretChangeInProduction

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

# Optionnels
GOOGLE_ID=
GOOGLE_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
WHATSAPP_RESTAURANT_PHONE=+216XXXXXXXX
WHATSAPP_API_TOKEN=
WHATSAPP_API_PHONE_ID=
```

### Frontend : `food-ordering-frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_anon_ou_publishable_key
```

> Pour Google OAuth, voir [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)

---

## 5. Commandes à exécuter (dans l'ordre)

### Étape 1 : Installer les dépendances

**Terminal 1 — Backend :**
```powershell
cd food-ordering-backend
npm install
```

**Terminal 2 — Frontend :**
```powershell
cd food-ordering-frontend
npm install
```

### Étape 2 : Exécuter le seed (créer admin + restaurant)

**Depuis le dossier backend :**
```powershell
cd food-ordering-backend
npm run seed
```

Résultat attendu :
```
✅ Connected to Supabase
✅ Admin créé: admin@crepetime.tn / CrepeTime2026!
✅ Restaurant créé: Crêpe Time Tunisia
   Menu: 12 crêpes | Livraison: 3.00 TND | ~30 min
```

### Étape 3 : Démarrer le backend

**Terminal 1 :**
```powershell
cd food-ordering-backend
npm run dev
```

Résultat attendu :
```
Connected to Supabase!
Crêpe Time Tunisia API started on port 5000
```

### Étape 4 : Démarrer le frontend

**Terminal 2 :**
```powershell
cd food-ordering-frontend
npm run dev
```

Résultat attendu :
```
VITE ready
Local: http://localhost:5173/
```

---

## 6. Liens disponibles et comment y accéder

### Liens clients (sans connexion)

| Lien | URL | Description |
|------|-----|-------------|
| **Accueil** | http://localhost:5173/ | Page d'accueil avec hero |
| **Menu** | http://localhost:5173/menu | Redirection directe vers le menu des crêpes |
| **Suivi de commande** | http://localhost:5173/order-status | Suivi des commandes |
| **Connexion** | http://localhost:5173/sign-in | Page de connexion |

### Liens admin (connexion requise)

| Lien | URL | Credentials |
|------|-----|-------------|
| **Gérer le restaurant** | http://localhost:5173/manage-restaurant | admin@crepetime.tn / CrepeTime2026! |
| **Tableau de bord** | http://localhost:5173/business-insights | idem |
| **Mon profil** | http://localhost:5173/user-profile | idem |

### Connexion admin rapide

1. Aller sur http://localhost:5173/sign-in
2. Dans le menu déroulant **« Test Accounts »**, choisir **Admin**
3. Les champs email et mot de passe sont pré-remplis
4. Cliquer sur **Sign In**
5. Accéder à http://localhost:5173/manage-restaurant

### Liens techniques (développeurs)

| Lien | URL | Description |
|------|-----|-------------|
| **API Health** | http://localhost:5000/health | Vérifier que le backend répond |
| **API Docs** | http://localhost:5173/api-docs | Documentation des endpoints |
| **API Status** | http://localhost:5173/api-status | Monitoring de l'API |

---

## 7. Modifications de code courantes

### Changer le menu

**Via l'interface admin :**
1. Se connecter en admin
2. Aller sur `/manage-restaurant`
3. Section « Menu » : ajouter / modifier / supprimer les crêpes
4. Enregistrer

**Via le seed :**
- Modifier `food-ordering-backend/scripts/seed-restaurant.ts`
- Changer le tableau `CREPE_MENU`
- Relancer `npm run seed`

### Changer les credentials admin

- Modifier `scripts/seed-restaurant.ts` (lignes 76–80)
- Supprimer l'ancien user en base si besoin
- Relancer `npm run seed`

### Changer le port du backend

- Backend : variable `PORT` dans `.env` ou `process.env.PORT`
- Frontend : `VITE_API_BASE_URL` dans `.env` (ex : `http://localhost:5001`)

### Ajouter une variable d'environnement

- Backend : ajouter dans `food-ordering-backend/.env` et `.env.example`
- Frontend : préfixer par `VITE_` (ex : `VITE_MY_VAR=value`)

---

## 8. Dépannage

### Erreur : "Cannot find module '@supabase/supabase-js'"

- Le seed doit être exécuté **depuis le dossier backend**
- Commande : `cd food-ordering-backend && npm run seed`
- Vérifiez que `npm install` a été exécuté

### Erreur : "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"

- Créez `.env` dans `food-ordering-backend` à partir de `.env.example`
- Remplissez `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` (Settings > API dans Supabase)

### Erreur : "Table 'profiles' not found"

- Exécutez le schéma SQL dans Supabase SQL Editor
- Fichiers : `001_initial_schema.sql` puis `002_supabase_auth.sql`

### Erreur : "Impossible de charger le menu"

- Le backend n'est pas démarré
- Vérifier : http://localhost:5000/health doit répondre
- Lancer : `cd food-ordering-backend && npm run dev`

### Page blanche sur /manage-restaurant

- Vérifier que vous êtes connecté
- Vérifier `JWT_SECRET_KEY` dans le `.env` backend (ne pas laisser `your_jwt_secret_here`)
- Se déconnecter et se reconnecter

### ERR_CONNECTION_REFUSED sur localhost:5000

- Le backend n'est pas lancé
- Lancer `npm run dev` dans `food-ordering-backend`

---

## Récapitulatif des credentials

| Usage | Email | Mot de passe |
|-------|-------|--------------|
| **Admin** | admin@crepetime.tn | CrepeTime2026! |
| **Test client** | test@user.com | 12345678 |

---

## Structure des dossiers

```
Restaurant-Food-Ordering-Management-System--React-MERN-FullStack-main/
├── food-ordering-backend/     # API Express + Supabase
│   ├── .env                  # Variables d'environnement (à créer)
│   ├── scripts/
│   │   └── seed-restaurant.ts
│   └── src/
├── food-ordering-frontend/    # App React + Vite
│   ├── .env                  # VITE_API_BASE_URL
│   └── src/
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── GUIDE_DEMARRAGE.md        # Ce guide
└── DEVELOPER_GUIDE.md        # Guide technique avancé
```
