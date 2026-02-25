# 🧇 Crêpe Time Tunisia

### *The Sweetest Escape*

> Plateforme premium de commande de crêpes artisanales en ligne — Full-Stack MERN  
> Livraison à domicile & retrait en boutique | Notification WhatsApp automatique

---

## Aperçu

**Crêpe Time Tunisia** est une application web complète de commande de crêpes artisanales, conçue pour offrir une expérience premium aux clients de Tunis. Les clients peuvent parcourir le menu, ajouter des crêpes à leur panier, passer commande avec paiement à la livraison, et suivre l'état de leur commande en temps réel. Le restaurant reçoit chaque commande via une notification WhatsApp automatique.

### Fonctionnalités principales

- **Menu interactif** — 12 crêpes artisanales avec descriptions et prix en TND
- **Panier dynamique** — Ajout, suppression, modification des quantités
- **Commande simplifiée** — Paiement à la livraison ou retrait en boutique
- **Notification WhatsApp** — Message automatique en arabe au restaurant pour chaque commande
- **Suivi de commande** — Statuts en temps réel (Reçue → Confirmée → En préparation → En livraison → Livrée)
- **Panel administrateur** — Gestion du restaurant, menu, et mise à jour des statuts
- **Tableau de bord analytique** — Statistiques de ventes, revenus, et clients
- **Authentification sécurisée** — JWT + Google OAuth
- **Upload d'images** — Cloudinary pour les photos du restaurant et du menu
- **Design responsive** — Interface premium purple/gold optimisée mobile

---

## Stack technique

| Couche | Technologies |
|--------|-------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Shadcn/ui (Radix) |
| **Backend** | Node.js, Express, TypeScript |
| **Base de données** | MongoDB + Mongoose |
| **Authentification** | JWT + Google OAuth 2.0 |
| **Images** | Cloudinary |
| **Notifications** | WhatsApp Business API / wa.me |
| **Sécurité** | Helmet, bcryptjs, CORS configuré |

---

## Démarrage rapide

### Prérequis

- **Node.js** v18+ et **npm** v9+
- **MongoDB** (local ou MongoDB Atlas)
- Un compte **Cloudinary** (gratuit)
- Un compte **Google Cloud** (pour OAuth, optionnel)

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd crepe-time-tunisia
```

### 2. Configuration du Backend

```bash
cd food-ordering-backend
cp .env.example .env
npm install
```

Remplir le fichier `.env` :

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/crepe-time-tunisia

# JWT — Générer un secret unique
JWT_SECRET_KEY=votre_secret_jwt_ici

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

# Google OAuth (optionnel)
GOOGLE_ID=votre_google_client_id
GOOGLE_SECRET=votre_google_client_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# WhatsApp — Numéro du restaurant
WHATSAPP_RESTAURANT_PHONE=+216XXXXXXXX

# WhatsApp Business API (optionnel — pour envoi automatique)
WHATSAPP_API_TOKEN=
WHATSAPP_API_PHONE_ID=
```

Lancer le serveur backend :

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:5000`.

### 3. Configuration du Frontend

```bash
cd food-ordering-frontend
cp .env.example .env
npm install
```

Remplir le fichier `.env` :

```env
VITE_API_BASE_URL=http://localhost:5000
```

Lancer le serveur frontend :

```bash
npm run dev
```

L'application est accessible sur `http://localhost:5173`.

---

## Structure du projet

```
crepe-time-tunisia/
├── food-ordering-backend/          # API Node.js + Express
│   ├── src/
│   │   ├── controllers/            # Logique métier
│   │   ├── middleware/              # Auth JWT + validation
│   │   ├── models/                  # Schémas MongoDB
│   │   ├── routes/                  # Points d'API
│   │   └── services/               # Service WhatsApp
│   │       └── whatsapp.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── food-ordering-frontend/         # Application React + Vite
│   ├── public/                     # Assets statiques (logo, hero)
│   ├── src/
│   │   ├── api/                    # Hooks d'API (React Query)
│   │   ├── auth/                   # Route protégée
│   │   ├── components/             # Composants réutilisables
│   │   │   └── ui/                 # Composants Shadcn/ui
│   │   ├── config/                 # Configuration (statuts, options)
│   │   ├── contexts/               # Contexte d'application
│   │   ├── forms/                  # Formulaires (restaurant, profil)
│   │   ├── layouts/                # Layout principal
│   │   ├── lib/                    # Utilitaires (API client)
│   │   ├── pages/                  # Pages de l'application
│   │   ├── assets/                 # Assets organisés
│   │   │   ├── logo/
│   │   │   ├── hero/
│   │   │   ├── menu-items/
│   │   │   └── icons/
│   │   ├── AppRoutes.tsx
│   │   ├── global.css
│   │   ├── main.tsx
│   │   └── types.ts
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── .gitignore
├── LICENSE                         # MIT
├── README.md
└── DEVELOPER_GUIDE.md
```

---

## API Endpoints

### Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/auth/register` | Inscription |
| `POST` | `/api/auth/login` | Connexion |
| `GET` | `/api/auth/google` | OAuth Google |
| `GET` | `/api/auth/validate-token` | Validation JWT |
| `POST` | `/api/auth/logout` | Déconnexion |

### Commandes

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/order/create` | Créer une commande (Cash on Delivery) |
| `GET` | `/api/order` | Mes commandes |

### Restaurant

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/restaurant/search/:city` | Rechercher par ville |
| `GET` | `/api/restaurant/:id` | Détails d'un restaurant |
| `GET` | `/api/my/restaurant` | Mon restaurant |
| `POST` | `/api/my/restaurant` | Créer un restaurant |
| `PUT` | `/api/my/restaurant` | Modifier un restaurant |
| `GET` | `/api/my/restaurant/order` | Commandes de mon restaurant |
| `PATCH` | `/api/my/restaurant/order/:id/status` | Mettre à jour le statut |

---

## Flux de commande

```
Client                          Backend                         Restaurant
  |                                |                                |
  |-- Ajouter au panier --------->|                                |
  |-- Confirmer commande -------->|                                |
  |                                |-- Sauvegarder (status: placed) |
  |                                |-- Construire message WhatsApp  |
  |<-- Retour: order + wa.me URL  |                                |
  |-- Ouvrir WhatsApp ----------->|                                |
  |                                |                        [Notification reçue]
  |                                |                                |
  |                                |     Restaurant confirme ------>|
  |<-- Statut mis à jour ---------|                                |
  |   (confirmed → inProgress     |                                |
  |    → outForDelivery            |                                |
  |    → delivered)                |                                |
```

---

## Notification WhatsApp

Chaque commande génère automatiquement un message WhatsApp en arabe avec :
- Numéro de commande
- Détails du client et adresse
- Liste complète des articles avec prix
- Total et méthode de paiement
- Ton chaleureux et accueillant

Le message est envoyé via :
1. **Mode direct** (par défaut) : URL `wa.me` ouverte automatiquement côté client
2. **Mode API** (optionnel) : WhatsApp Business API pour envoi 100% automatique

---

## Ajouter de nouvelles crêpes

1. Connectez-vous en tant que propriétaire du restaurant
2. Allez dans **Manage Restaurant** → section **Menu**
3. Cliquez sur **Add Menu Item**
4. Renseignez le nom et le prix en TND
5. Cliquez sur **Submit**

Les nouvelles crêpes apparaissent immédiatement dans le menu public.

---

## Déploiement

### Frontend (Vercel)

```bash
cd food-ordering-frontend
npm run build
# Déployer le dossier dist/ sur Vercel
# Variable d'environnement: VITE_API_BASE_URL = URL du backend
```

### Backend (Render / Railway)

```bash
cd food-ordering-backend
npm run build
# Déployer sur Render ou Railway
# Configurer toutes les variables d'environnement du .env
# Start command: npm start
```

---

## Configuration WhatsApp

### Option 1 : wa.me (recommandé pour commencer)

Configurez uniquement `WHATSAPP_RESTAURANT_PHONE` dans le `.env` backend avec le numéro du restaurant au format international (`+216XXXXXXXX`). Les commandes ouvriront automatiquement WhatsApp avec le message pré-rempli.

### Option 2 : WhatsApp Business API (envoi automatique)

1. Créez un compte [Meta Business](https://business.facebook.com)
2. Configurez WhatsApp Business API
3. Obtenez le token API et l'ID du numéro
4. Ajoutez dans `.env` :
   - `WHATSAPP_API_TOKEN=votre_token`
   - `WHATSAPP_API_PHONE_ID=votre_phone_id`

---

## Identité visuelle

| Élément | Valeur |
|---------|--------|
| **Primaire** | Deep Purple `#4C1D95` |
| **Accent** | Elegant Gold `#D4AF37` |
| **Fond sombre** | `#0F0A1F` |
| **Texte** | `#FFFFFF` / `#E5E5E5` |
| **Devise** | TND (Dinar Tunisien) |
| **Langue principale** | Français |
| **Notifications** | Arabe tunisien |

---

## Crédits

Conçu et développé avec passion par **[Marouan Rabai](https://marwenrabai.netlify.app)**.

**Crêpe Time Tunisia** — *The Sweetest Escape* 🧇

---

## Licence

Ce projet est sous licence [MIT](LICENSE).
