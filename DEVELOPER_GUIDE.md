# Crêpe Time Tunisia — Guide Développeur

> Guide technique avancé pour les développeurs travaillant sur le projet Crêpe Time Tunisia.

---

## Table des matières

1. [Architecture](#architecture)
2. [Backend en détail](#backend-en-détail)
3. [Frontend en détail](#frontend-en-détail)
4. [Système de thème](#système-de-thème)
5. [Flux de commande](#flux-de-commande)
6. [Service WhatsApp](#service-whatsapp)
7. [Authentification](#authentification)
8. [Gestion des images](#gestion-des-images)
9. [Ajout de fonctionnalités](#ajout-de-fonctionnalités)
10. [Checklist de sécurité](#checklist-de-sécurité)
11. [Conventions de code](#conventions-de-code)
12. [Dépannage](#dépannage)

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│   React + Vite  │────▶│  Express + TS    │────▶│  MongoDB    │
│   (Port 5173)   │     │  (Port 5000)     │     │             │
│                 │     │                  │     │  - Users    │
│  Tailwind CSS   │     │  JWT Auth        │     │  - Orders   │
│  Shadcn/ui      │     │  Helmet          │     │  - Restaurants│
│  React Query    │     │  CORS            │     │             │
└─────────────────┘     │  Cloudinary      │     └─────────────┘
                        │  WhatsApp Service│
                        └──────────────────┘
```

### Principe des prix

Les prix sont stockés en **millimes** (centièmes de TND) dans la base de données pour éviter les erreurs de virgule flottante. Un prix affiché de `10.00 TND` est stocké comme `1000`.

- **Saisie admin** : L'utilisateur entre `10` → le backend multiplie par 100 → stocké `1000`
- **Affichage** : La valeur stockée `1000` → le frontend divise par 100 → affiche `10.00 TND`

---

## Backend en détail

### Structure des contrôleurs

| Contrôleur | Responsabilité |
|-----------|---------------|
| `OrderController` | Création de commande, récupération des commandes utilisateur, envoi WhatsApp |
| `MyRestaurantController` | CRUD restaurant, gestion des commandes entrantes, mise à jour des statuts |
| `MyUserController` | Profil utilisateur |
| `RestaurantController` | Recherche publique de restaurants |
| `AnalyticsController` | Tableau de bord analytique |

### Modèle Order

```typescript
{
  restaurant: ObjectId,        // Ref Restaurant
  user: ObjectId,              // Ref User
  deliveryDetails: {
    email: string,
    name: string,
    addressLine1: string,
    city: string,
    phone: string              // Nouveau champ
  },
  cartItems: [{
    menuItemId: string,
    quantity: number,
    name: string
  }],
  totalAmount: number,         // En millimes (ex: 1400 = 14.00 TND)
  paymentMethod: "cash" | "pickup",
  status: "placed" | "confirmed" | "inProgress" | "outForDelivery" | "delivered",
  createdAt: Date
}
```

### Cycle de vie d'une commande

```
placed → confirmed → inProgress → outForDelivery → delivered
```

| Statut | Qui le déclenche | Description |
|--------|-----------------|-------------|
| `placed` | Système | Commande créée par le client |
| `confirmed` | Restaurant | Le restaurant accepte la commande |
| `inProgress` | Restaurant | La crêpe est en cours de préparation |
| `outForDelivery` | Restaurant | Le livreur est en route |
| `delivered` | Restaurant | Le client a reçu sa commande |

### Middleware

- **`auth.ts`** — Vérifie le JWT (Bearer token ou cookie `session_id`)
- **`validation.ts`** — Validation des entrées avec `express-validator`

---

## Frontend en détail

### Pages

| Page | Route | Description |
|------|-------|-------------|
| `HomePage` | `/` | Page d'accueil avec recherche |
| `SearchPage` | `/search/:city` | Résultats de recherche |
| `DetailPage` | `/detail/:restaurantId` | Menu du restaurant + panier |
| `OrderStatusPage` | `/order-status` | Suivi des commandes |
| `ManageRestaurantPage` | `/manage-restaurant` | Panel admin restaurant |
| `UserProfilePage` | `/user-profile` | Profil utilisateur |
| `SignInPage` | `/sign-in` | Connexion |
| `RegisterPage` | `/register` | Inscription |

### Hooks API (React Query)

| Hook | Fichier | Fonction |
|------|---------|----------|
| `useCreateOrder` | `OrderApi.tsx` | Crée une commande (POST `/api/order/create`) |
| `useGetMyOrders` | `OrderApi.tsx` | Récupère les commandes (polling 5s) |
| `useGetRestaurant` | `RestaurantApi.tsx` | Détails d'un restaurant |
| `useSearchRestaurants` | `RestaurantApi.tsx` | Recherche avec filtres |
| `useGetMyUser` | `MyUserApi.tsx` | Profil de l'utilisateur connecté |

### Panier (sessionStorage)

Le panier utilise `sessionStorage` avec une clé par restaurant (`cartItems-{restaurantId}`). Il est automatiquement vidé quand l'utilisateur quitte la page du restaurant.

---

## Système de thème

### Variables CSS (global.css)

Le thème utilise des variables CSS HSL consommées par Tailwind via `hsl(var(--xxx))`. Modifier les couleurs dans `:root` de `global.css` suffit à transformer tout le thème.

### Couleurs personnalisées (tailwind.config.js)

```javascript
crepe: {
  purple: '#4C1D95',
  'purple-light': '#6D28D9',
  'purple-dark': '#3B0764',
  gold: '#D4AF37',
  'gold-light': '#E5C76B',
  dark: '#0F0A1F',
  surface: '#1A1233',
}
```

Usage : `bg-crepe-purple`, `text-crepe-gold`, `hover:bg-crepe-purple-light`, etc.

### Composants Shadcn/ui

Les composants dans `src/components/ui/` utilisent les variables CSS du thème. Ils répondent automatiquement aux changements de couleurs.

---

## Service WhatsApp

### Fichier : `src/services/whatsapp.ts`

Le service construit un message en arabe avec les détails de la commande et génère une URL `wa.me`.

### Ajouter un nouveau template de message

Modifier la fonction `buildWhatsAppMessage()` dans `whatsapp.ts`. Le message supporte :
- Variables dynamiques (nom, adresse, articles, prix)
- Formatage WhatsApp (`*gras*`, `_italique_`)
- Emojis

### Activer l'envoi automatique

1. Obtenir un token WhatsApp Business API
2. Configurer `WHATSAPP_API_TOKEN` et `WHATSAPP_API_PHONE_ID`
3. Le service essaiera automatiquement l'API avant de fallback sur wa.me

---

## Authentification

### Flux JWT

1. L'utilisateur se connecte (`/api/auth/login`)
2. Le serveur retourne un JWT (valide 24h)
3. Le frontend stocke le token dans `localStorage` (`session_id`)
4. Chaque requête API inclut le token dans le header `Authorization: Bearer <token>`
5. Le middleware `verifyToken` vérifie et décode le JWT

### Google OAuth

1. Le frontend redirige vers `/api/auth/google`
2. Google authentifie et redirige vers `/api/auth/callback/google`
3. Le backend crée/met à jour l'utilisateur et génère un JWT
4. Redirection vers `/auth/callback?token=...&userId=...`
5. Le frontend stocke le token et redirige vers la page d'accueil

---

## Gestion des images

Les images sont uploadées vers **Cloudinary** via le backend :
1. Le frontend envoie l'image en `multipart/form-data`
2. Le middleware `multer` stocke l'image en mémoire
3. Le contrôleur convertit en base64 et upload vers Cloudinary
4. L'URL Cloudinary est sauvegardée dans la base de données

---

## Ajout de fonctionnalités

### Ajouter une nouvelle crêpe au menu (via code)

Les crêpes sont gérées dynamiquement via le panel admin. Aucun code n'est nécessaire.

### Ajouter un nouveau statut de commande

1. Modifier l'enum dans `food-ordering-backend/src/models/order.ts`
2. Ajouter le statut dans `food-ordering-frontend/src/types.ts` (`OrderStatus`)
3. Ajouter le label dans `food-ordering-frontend/src/config/order-status-config.ts`
4. Ajouter les couleurs/icônes dans `OrderStatusPage.tsx`, `EnhancedOrdersTab.tsx`, `OrderItemCard.tsx`

### Ajouter un mode de paiement

1. Ajouter la valeur dans l'enum `paymentMethod` du modèle Order
2. Mettre à jour le type `CreateOrderRequest` dans `OrderApi.tsx`
3. Ajouter l'option dans le flux de checkout (`DetailPage.tsx`)
4. Mettre à jour le template WhatsApp (`whatsapp.ts`)

### Ajouter une langue

L'application utilise des chaînes de caractères codées en dur (pas d'i18n library). Pour ajouter une langue :
1. Créer un fichier de traduction (ex: `src/i18n/ar.ts`)
2. Remplacer les chaînes par des appels à la fonction de traduction
3. Ajouter un sélecteur de langue dans le header

---

## Checklist de sécurité

- [x] JWT avec expiration (24h)
- [x] Mots de passe hashés (bcryptjs)
- [x] Helmet pour les headers HTTP
- [x] CORS configuré (origines explicites)
- [x] Validation des entrées (express-validator)
- [x] Variables d'environnement pour les secrets
- [x] IDs MongoDB validés avant utilisation
- [x] Pas de secrets dans le code source
- [ ] Rate limiting (recommandé pour la production)
- [ ] HTTPS en production
- [ ] CSP (Content Security Policy) en production

---

## Conventions de code

- **TypeScript strict** — Frontend et backend
- **Nommage** — camelCase pour les variables/fonctions, PascalCase pour les composants
- **Imports** — Alias `@/` pour `src/` (frontend)
- **Composants** — Un composant par fichier, export default
- **API hooks** — Fichiers séparés par domaine dans `src/api/`
- **Pas de commentaires narratifs** — Le code doit être auto-descriptif

---

## Dépannage

### Le backend ne démarre pas

- Vérifier que MongoDB est accessible (`MONGODB_URI`)
- Vérifier que le port 5000 n'est pas occupé
- Vérifier que toutes les variables d'environnement sont configurées

### Les images ne s'uploadent pas

- Vérifier les identifiants Cloudinary (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`)
- Vérifier la taille de l'image (max 5 MB)

### Google OAuth ne fonctionne pas

- Vérifier `GOOGLE_ID` et `GOOGLE_SECRET`
- Vérifier que l'URL de callback est autorisée dans Google Cloud Console : `{BACKEND_URL}/api/auth/callback/google`

### WhatsApp ne s'ouvre pas

- Vérifier que `WHATSAPP_RESTAURANT_PHONE` est au format international (`+216XXXXXXXX`)
- Sur desktop, WhatsApp Web doit être connecté

---

*Guide technique par [Marouan Rabai](https://marwenrabai.netlify.app) — Crêpe Time Tunisia v1.0*
