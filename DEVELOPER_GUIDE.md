# Crêpe Time Tunisia — Guide Développeur Avancé

> **La référence technique ultime pour bâtir la plateforme de crêperie la plus sophistiquée de Tunisie.**
>
> Ce document couvre chaque couche de l'architecture — du frontend React/Vite au backend Express/TypeScript,
> en passant par le déploiement cloud, la publication mobile et les stratégies de mise à l'échelle.
> Que vous rejoigniez l'équipe ou que vous construisiez depuis zéro, ce guide est votre boussole.

---

## 🚀 Démarrage rapide

**Nouveau sur le projet ?** Consultez d'abord **[GUIDE_DEMARRAGE.md](./GUIDE_DEMARRAGE.md)** pour :
- Par où commencer
- Comptes et credentials à configurer
- Commandes à exécuter (seed : `npm run seed` dans `food-ordering-backend`)
- Liens disponibles et accès admin

---

## Table des matières

1. [Architecture Overview](#architecture-overview)
2. [Backend en détail](#backend-en-détail)
3. [Frontend en détail](#frontend-en-détail)
4. [Système de thème](#système-de-thème)
5. [Service WhatsApp](#service-whatsapp)
6. [Authentification](#authentification)
7. [Gestion des images](#gestion-des-images)
8. [Menu Seed Script](#menu-seed-script)
9. [Ajout de fonctionnalités](#ajout-de-fonctionnalités)
10. [Finding Links for Customers and Admin](#finding-links-for-customers-and-admin)
11. [Déploiement](#déploiement)
12. [Making the App Ready for Play Store and iOS App Store](#making-the-app-ready-for-play-store-and-ios-app-store)
13. [Scalability Tips](#scalability-tips)
14. [Security Best Practices](#security-best-practices)
15. [Future Roadmap](#future-roadmap)
16. [Conventions de code](#conventions-de-code)
17. [Dépannage](#dépannage)

---

## Architecture Overview

Crêpe Time Tunisia repose sur une architecture **React + Node + Supabase** — Express/TypeScript côté serveur, Supabase (PostgreSQL) pour la base de données, et un frontend Vite ultra-rapide. Ce socle technique a été conçu pour offrir une expérience fluide aux clients de Nabeul tout en restant extensible vers de nouveaux points de vente.

```
┌─────────────────────────┐          ┌─────────────────────────┐          ┌────────────────┐
│   React + Vite (5173)   │   HTTP   │  Express + TS (5000)    │ Supabase │   PostgreSQL   │
│                         │─────────▶│                         │─────────▶│                │
│  Tailwind CSS           │          │  JWT Auth               │  Client  │  - profiles    │
│  Shadcn/ui              │          │  Helmet + CORS + rate-limit │          │  - orders      │
│  React Query            │          │  express-validator      │          │  - restaurants │
│  React Router v6        │          │                         │          └────────────────┘
└─────────────────────────┘          │  ┌───────────────────┐  │
                                     │  │ Cloudinary        │  │
                                     │  │ (Upload images)   │  │
                                     │  ├───────────────────┤  │
                                     │  │ WhatsApp Service  │  │
                                     │  │ (Notifications)   │  │
                                     │  └───────────────────┘  │
                                     └─────────────────────────┘
```

### Le système de prix en millimes

Les prix sont stockés en **millimes** (centièmes de dinar tunisien) dans PostgreSQL afin d'éliminer toute erreur de virgule flottante. Un prix affiché de `10.00 TND` correspond à la valeur `1000` en base de données.

| Direction        | Transformation                                                                   |
|------------------|-----------------------------------------------------------------------------------|
| **Saisie admin** | L'administrateur entre `10` → le backend multiplie par 100 → valeur stockée `1000` |
| **Affichage**    | La valeur `1000` → le frontend divise par 100 → affiché `10.00 TND`               |

Ce choix garantit une précision absolue sur les calculs de totaux, de remises et de taxes, même pour les commandes les plus complexes.

---

## Backend en détail

### Structure des contrôleurs

| Contrôleur                | Responsabilité                                                                  |
|---------------------------|----------------------------------------------------------------------------------|
| `OrderController`         | Création de commande, récupération des commandes client, déclenchement WhatsApp  |
| `MyRestaurantController`  | CRUD restaurant, gestion des commandes entrantes, mise à jour des statuts        |
| `MyUserController`        | Gestion du profil utilisateur (nom, adresse, téléphone)                          |
| `RestaurantController`    | Recherche publique de restaurants et consultation des menus                       |
| `AnalyticsController`     | Tableau de bord analytique, statistiques de vente et indicateurs de performance   |

### Modèle Order (PostgreSQL / API)

```typescript
{
  restaurant_id: UUID,
  user_id: UUID | null,
  deliveryDetails: {
    email: string,
    name: string,
    addressLine1: string,
    city: string,
    phone: string
  },
  cartItems: [{
    menuItemId: string,
    quantity: number,
    name: string
  }],
  totalAmount: number,            // En millimes (ex: 1400 = 14.00 TND)
  paymentMethod: "cash" | "pickup",
  status: "placed" | "confirmed" | "inProgress" | "outForDelivery" | "delivered",
  createdAt: Date
}
```

### Cycle de vie d'une commande

Chaque commande suit un parcours linéaire strict, depuis sa création par le client jusqu'à la livraison finale :

```
placed ──▶ confirmed ──▶ inProgress ──▶ outForDelivery ──▶ delivered
```

| Statut           | Déclencheur | Description                                        |
|------------------|-------------|----------------------------------------------------|
| `placed`         | Système     | La commande vient d'être créée par le client        |
| `confirmed`      | Restaurant  | Le restaurant a accepté la commande                 |
| `inProgress`     | Restaurant  | La crêpe est en cours de préparation                |
| `outForDelivery` | Restaurant  | Le livreur est en route vers le client              |
| `delivered`      | Restaurant  | Le client a bien reçu sa commande                   |

### Middleware

| Middleware      | Rôle                                                                          |
|-----------------|-------------------------------------------------------------------------------|
| `auth.ts`       | Vérifie le JWT (Bearer token dans le header ou cookie `session_id`)           |
| `validation.ts` | Validation des données entrantes via `express-validator` avant tout traitement |

---

## Frontend en détail

### Pages et routes

| Page                   | Route                   | Description                                |
|------------------------|-------------------------|--------------------------------------------|
| `HomePage`             | `/`                     | Page d'accueil avec barre de recherche     |
| `SearchPage`           | `/search/:city`         | Résultats de recherche par ville            |
| `DetailPage`           | `/detail/:restaurantId` | Menu du restaurant avec panier interactif  |
| `OrderStatusPage`      | `/order-status`         | Suivi en temps réel des commandes          |
| `ManageRestaurantPage` | `/manage-restaurant`    | Panel d'administration restaurant          |
| `UserProfilePage`      | `/user-profile`         | Gestion du profil utilisateur              |
| `SignInPage`           | `/sign-in`              | Page de connexion                          |
| `RegisterPage`         | `/register`             | Page d'inscription                         |

### Hooks API (React Query)

| Hook                   | Fichier             | Fonction                                                    |
|------------------------|---------------------|-------------------------------------------------------------|
| `useCreateOrder`       | `OrderApi.tsx`      | Crée une commande (`POST /api/order/create`)                |
| `useGetMyOrders`       | `OrderApi.tsx`      | Récupère les commandes avec polling automatique toutes les 5s|
| `useGetRestaurant`     | `RestaurantApi.tsx` | Détails complets d'un restaurant et de son menu             |
| `useSearchRestaurants` | `RestaurantApi.tsx` | Recherche avec filtres, pagination et tri                   |
| `useGetMyUser`         | `MyUserApi.tsx`     | Profil de l'utilisateur connecté                            |

### Système de panier (sessionStorage)

Le panier est persisté dans `sessionStorage` avec une clé unique par restaurant : `cartItems-{restaurantId}`. Ce mécanisme isole parfaitement les paniers entre différents restaurants et efface automatiquement les données à la fermeture de l'onglet — un comportement idéal pour une commande unique en point de vente.

### Améliorations UI/UX (page d'accueil)

La page d'accueil intègre des éléments UI/UX premium pour une expérience luxueuse :

| Composant | Description |
|-----------|-------------|
| **BrandMarquee** | Bandeau défilant « Crêpe Time Tunisia – The Sweetest Escape » en or sur fond violet (react-fast-marquee) |
| **CrepeHighlightsSection** | Cartes 3D tilt (Framer Motion) avec effet parallax au scroll, glassmorphism, liens vers le menu |
| **TestimonialCarousel** | Carousel de témoignages avec auto-play, pause au survol, navigation clavier et ARIA |
| **CallToActionSection** | CTA ultra-premium avec glassmorphism, parallax, bouton dynamique (teaser personnalisé/heure), marquee de phrases premium, particules dorées au survol, Lottie (ingrédients), haptic feedback mobile, support `prefers-reduced-motion` |

**Librairies utilisées :** `framer-motion` (animations), `react-fast-marquee` (marquee), `@lottiefiles/react-lottie-player` (Lottie). Typographie : Playfair Display pour les titres.

---

## Call to Action (CTA) — Section Premium

La section CTA (`CallToActionSection.tsx`) a été transformée en une expérience ultra-premium :

- **Glassmorphism** : Fond violet foncé avec overlay flou et bordures dorées
- **Bouton dynamique** : Texte adapté à l’heure (Breakfast Bliss, Evening Indulgence, etc.) ou personnalisé si l’utilisateur est connecté et a une préférence (`localStorage.crepe_favorite_flavor`)
- **Marquee** : Phrases premium (« The Sweetest Escape Awaits », etc.) en défilement infini
- **Animations** : Parallax au scroll, particules dorées au survol du bouton, transitions Framer Motion
- **Lottie** : Animation optionnelle (ingrédients/crêpe) via `VITE_LOTTIE_CREPE_URL` — lazy-loadée
- **Accessibilité** : ARIA, focus clavier, `prefers-reduced-motion` pour désactiver les animations
- **Mobile** : Haptic feedback (`navigator.vibrate`) sur les appareils supportés

---

## Système de thème

### Variables CSS (global.css)

Le thème s'appuie sur des variables CSS au format HSL, consommées par Tailwind via `hsl(var(--xxx))`. Modifier les valeurs dans le bloc `:root` de `global.css` transforme instantanément l'apparence complète de l'application.

### Palette personnalisée Crêpe Time (tailwind.config.js)

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

### Utilisation dans les composants

```html
<div class="bg-crepe-purple text-white">
  <h1 class="text-crepe-gold font-bold">Crêpe Time</h1>
  <button class="bg-crepe-gold hover:bg-crepe-gold-light text-crepe-dark">
    Commander
  </button>
</div>

<section class="bg-crepe-dark border border-crepe-surface rounded-xl">
  <p class="text-crepe-gold-light">Contenu premium</p>
</section>
```

Les composants Shadcn/ui dans `src/components/ui/` héritent automatiquement de ces variables CSS pour une cohérence visuelle totale.

---

## Service WhatsApp

### Fichier source

`src/services/whatsapp.ts`

Le service construit un message formaté en arabe contenant les détails complets de la commande (nom du client, adresse de livraison, articles commandés, total) et génère une URL `wa.me` pour un envoi direct depuis le navigateur.

### Modifier les templates de message

Éditez la fonction `buildWhatsAppMessage()` dans `whatsapp.ts`. Le formatage WhatsApp natif est supporté :

- `*texte*` pour le **gras**
- `_texte_` pour l'*italique*
- Variables dynamiques : nom du client, adresse, liste des articles, prix total en TND

### Activer l'envoi automatique via WhatsApp Business API

1. Obtenir un token d'accès WhatsApp Business API depuis Meta for Developers
2. Configurer les variables d'environnement `WHATSAPP_API_TOKEN` et `WHATSAPP_API_PHONE_ID`
3. Le service tentera automatiquement l'envoi via l'API ; en cas d'échec, il basculera sur le lien `wa.me` classique

---

## Authentification

### Flux JWT (5 étapes)

1. L'utilisateur soumet ses identifiants via `POST /api/auth/login`
2. Le serveur vérifie les credentials avec bcryptjs et génère un JWT valide **24 heures**
3. Le frontend stocke le token dans `localStorage` sous la clé `session_id`
4. Chaque requête API inclut le header `Authorization: Bearer <token>`
5. Le middleware `verifyToken` décode et valide le JWT à chaque requête protégée

### Flux Google OAuth (5 étapes)

1. Le frontend redirige l'utilisateur vers `GET /api/auth/google`
2. Google authentifie l'utilisateur et redirige vers `/api/auth/callback/google`
3. Le backend crée ou met à jour le compte utilisateur, puis génère un JWT
4. Redirection vers `/auth/callback?token=...&userId=...`
5. Le frontend intercepte les paramètres URL, stocke le token et redirige vers la page d'accueil

---

## Gestion des images

### Flux d'upload Cloudinary (4 étapes)

1. Le frontend envoie l'image en `multipart/form-data` via le formulaire d'administration
2. Le middleware `multer` intercepte le fichier et le stocke temporairement en mémoire (buffer)
3. Le contrôleur convertit le buffer en data URI base64 et l'uploade vers Cloudinary
4. L'URL publique CDN retournée par Cloudinary est sauvegardée dans Supabase (table restaurants)

---

## Menu Seed Script

Le script de seed crée automatiquement le restaurant **Crêpe Time — Nabeul** avec les 12 crêpes signature. Exécutez-le depuis la racine du projet :

```bash
cd food-ordering-backend
npm run seed
```

### Menu complet — Les 12 crêpes Crêpe Time

| #  | Crêpe                       | Prix (TND) | Image                     |
|----|-----------------------------|------------|---------------------------|
| 1  | Crêpe Nutella Banane        | 12.00      | `nutella-banane.jpg`      |
| 2  | Crêpe Fraise Crème          | 14.00      | `fraise-creme.jpg`        |
| 3  | Crêpe Lotus Biscoff         | 15.00      | `lotus-biscoff.jpg`       |
| 4  | Crêpe Kinder Bueno          | 16.00      | `kinder-bueno.jpg`        |
| 5  | Crêpe Oréo Crème            | 14.00      | `oreo-creme.jpg`          |
| 6  | Crêpe Caramel Noix de Pécan | 15.00      | `caramel-noix-pecan.jpg`  |
| 7  | Crêpe Fruits des Bois       | 13.00      | `fruits-des-bois.jpg`     |
| 8  | Crêpe Pistache Rose         | 17.00      | `pistache-rose.jpg`       |
| 9  | Crêpe Coco Mangue           | 14.00      | `coco-mangue.jpg`         |
| 10 | Crêpe Miel & Noix           | 11.00      | `miel-noix.jpg`           |
| 11 | Crêpe Sucre & Citron        | 9.00       | `sucre-citron.jpg`        |
| 12 | Crêpe Time Signature        | 19.00      | `crepe-time-signature.jpg`|

Les images de référence sont disponibles dans `food-ordering-frontend/src/assets/menu-items/`.

---

## Ajout de fonctionnalités

### Ajouter une nouvelle crêpe

Les crêpes sont gérées dynamiquement via le panel d'administration (`/manage-restaurant`). Aucune modification du code source n'est nécessaire — ajoutez simplement le nom, le prix et l'image depuis l'interface admin.

### Ajouter un nouveau statut de commande

1. **Modèle backend** — Modifier l'enum `status` dans `food-ordering-backend/src/models/order.ts`
2. **Types frontend** — Ajouter le nouveau statut dans `food-ordering-frontend/src/types.ts` (type `OrderStatus`)
3. **Configuration UI** — Ajouter le label et l'icône dans `food-ordering-frontend/src/config/order-status-config.ts`
4. **Composants** — Mettre à jour `OrderStatusPage.tsx`, `EnhancedOrdersTab.tsx` et `OrderItemCard.tsx`

### Ajouter un mode de paiement

1. **Modèle** — Ajouter la valeur dans l'enum `paymentMethod` du modèle Order
2. **Types API** — Mettre à jour le type `CreateOrderRequest` dans `OrderApi.tsx`
3. **Interface checkout** — Ajouter l'option dans le flux de paiement (`DetailPage.tsx`)
4. **Notifications** — Mettre à jour le template WhatsApp dans `whatsapp.ts`

### Ajouter une nouvelle langue

L'application utilise actuellement des chaînes codées en dur. Pour internationaliser :

1. Créer un fichier de traduction par langue (ex: `src/i18n/ar.ts`, `src/i18n/en.ts`, `src/i18n/fr.ts`)
2. Remplacer les chaînes statiques par des appels à une fonction de traduction `t('key')`
3. Ajouter un sélecteur de langue dans le header de l'application

---

## Finding Links for Customers and Admin

### Credentials Admin (après seed)

| Champ | Valeur |
|-------|--------|
| Email | `admin@crepetime.tn` |
| Mot de passe | `CrepeTime2026!` |
| URL admin | `/manage-restaurant` |

Sur la page Sign In, sélectionnez « Admin » dans le menu déroulant pour pré-remplir les identifiants.

### Commande en tant qu'invité (Guest)

Les clients peuvent commander **sans créer de compte**. Sur la page détail du restaurant, le bouton « Commander en tant qu'invité » ouvre un formulaire avec : nom, téléphone, adresse, ville, pays. La commande est créée via `POST /api/order/create-guest` (sans authentification).

### Accès client

L'URL principale pour les clients de Nabeul est votre domaine personnalisé :

```
https://crepetime.tn
```

Les clients y accèdent pour parcourir le menu, passer des commandes et suivre leurs livraisons en temps réel.

### Panel d'administration

Le panel d'administration du restaurant est accessible directement via :

```
https://crepetime.tn/manage-restaurant
```

Cette route est protégée par l'authentification JWT. Seuls les utilisateurs ayant le rôle restaurant peuvent y accéder et gérer les commandes, le menu et les paramètres.

### Configuration du domaine personnalisé

**Frontend (Vercel)** — Ajoutez votre domaine dans les paramètres du projet Vercel :

1. Allez dans *Settings > Domains* et ajoutez `crepetime.tn`
2. Configurez les enregistrements DNS chez votre registrar tunisien

**Backend (Render/Railway)** — Configurez un sous-domaine pour l'API :

1. Ajoutez `api.crepetime.tn` dans les paramètres du service backend
2. Configurez les enregistrements DNS correspondants

**Exemple de configuration DNS :**

```
Type    Nom       Valeur                        TTL
A       @         76.76.21.21                   3600
CNAME   www       cname.vercel-dns.com          3600
CNAME   api       your-backend.onrender.com     3600
```

---

## Déploiement

### Frontend sur Vercel

```bash
# Build command (configuré dans Vercel)
cd food-ordering-frontend && npm run build

# Output directory
dist
```

**Variables d'environnement Vercel :**

| Variable                 | Valeur                          |
|--------------------------|---------------------------------|
| `VITE_API_BASE_URL`     | `https://api.crepetime.tn`     |
| `VITE_GOOGLE_CLIENT_ID` | Votre ID client Google OAuth   |

**Domaine personnalisé :** Ajoutez `crepetime.tn` et `www.crepetime.tn` dans *Settings > Domains*. Vercel fournit automatiquement un certificat SSL Let's Encrypt.

### Backend sur Render / Railway

```bash
# Start command
cd food-ordering-backend && npm run start
```

**Variables d'environnement requises :**

| Variable                     | Description                            |
|------------------------------|----------------------------------------|
| `SUPABASE_URL`               | URL du projet Supabase                 |
| `SUPABASE_SERVICE_ROLE_KEY`  | Clé service role Supabase (Settings > API) |
| `JWT_SECRET_KEY`             | Clé secrète pour signer les tokens JWT |
| `CLOUDINARY_CLOUD_NAME`      | Nom du cloud Cloudinary                |
| `CLOUDINARY_API_KEY`         | Clé API Cloudinary                     |
| `CLOUDINARY_API_SECRET`      | Secret API Cloudinary                  |
| `GOOGLE_ID`                  | ID client Google OAuth                 |
| `GOOGLE_SECRET`              | Secret client Google OAuth             |
| `WHATSAPP_RESTAURANT_PHONE`  | Numéro WhatsApp au format `+216...`    |
| `FRONTEND_URL`               | `https://crepetime.tn`                |

**Supabase :** Créez un projet gratuit sur supabase.com. Exécutez le schéma SQL dans `supabase/migrations/001_initial_schema.sql`.

### Checklist de production

- [ ] HTTPS activé sur le frontend et le backend
- [ ] CORS configuré avec les origines exactes de production
- [ ] Toutes les variables d'environnement définies (aucune valeur par défaut en production)
- [ ] `NODE_ENV=production` défini sur le serveur backend
- [ ] Logs de production activés
- [ ] Monitoring des erreurs configuré (Sentry ou équivalent)

---

## Making the App Ready for Play Store and iOS App Store

### Pourquoi Capacitor

Capacitor permet d'encapsuler votre application React/Vite dans un conteneur natif Android et iOS, **sans réécrire une seule ligne de code**. L'application web existante devient une application mobile installable, distribuable sur les stores.

### Installation et configuration

```bash
# Depuis le dossier frontend
cd food-ordering-frontend

# 1. Installer Capacitor
npm install @capacitor/core @capacitor/cli

# 2. Initialiser le projet Capacitor
npx cap init "Crêpe Time Tunisia" "tn.crepetime.app"

# 3. Builder l'application Vite
npm run build

# 4. Ajouter les plateformes
npx cap add android
npx cap add ios

# 5. Synchroniser les assets web vers les projets natifs
npx cap copy

# 6. Ouvrir dans Android Studio
npx cap open android

# 7. Ouvrir dans Xcode (macOS uniquement)
npx cap open ios
```

### Icône de l'application

Utilisez le logo Crêpe Time (`logo.png`) et redimensionnez-le aux tailles requises :

- **Android** : Adaptive icon 108x108 dp (432x432 px pour xxxhdpi)
- **iOS** : 1024x1024 px pour l'App Store, avec toutes les variantes requises

L'outil `@capacitor/assets` peut générer automatiquement toutes les déclinaisons nécessaires.

### Liens WhatsApp natifs

- **Android** : Utilisez les URLs `intent://` pour ouvrir WhatsApp directement dans l'application native
- **iOS** : Utilisez les Universal Links (`https://wa.me/...`) qui s'ouvrent nativement dans WhatsApp

### Notifications push

```bash
npm install @capacitor/push-notifications
npx cap sync
```

Ce plugin permet d'envoyer des notifications push natives pour chaque mise à jour de statut de commande — une fonctionnalité essentielle pour l'expérience utilisateur mobile.

### Publication sur les stores

**Google Play Console :**

- Frais d'inscription : **25 USD** (paiement unique)
- Processus de review : environ **1 semaine**
- Format requis : AAB (Android App Bundle)

**Apple Developer Program :**

- Frais annuels : **99 USD/an**
- Processus de review : environ **1 à 2 semaines**
- Nécessite un Mac avec Xcode pour la compilation et la soumission

**Délai estimé :** Comptez **2 à 3 semaines** pour publier sur les deux plateformes, incluant les tests, les ajustements de review et la validation finale.

---

## Scalability Tips

### Mise à l'échelle horizontale du backend

Déployez plusieurs instances du serveur Express derrière un load balancer (Render le supporte nativement, ou utilisez un reverse proxy Nginx). Les sessions JWT étant stateless, aucune gestion de session partagée n'est nécessaire.

### Mise à l'échelle Supabase

Pour des volumes importants, Supabase propose des plans Pro avec plus de ressources. Utilisez les index appropriés (déjà définis dans le schéma) et le connection pooling pour optimiser les performances.

### CDN pour les images

Cloudinary fournit déjà un CDN mondial. Pour les assets statiques du frontend, Vercel déploie automatiquement sur son réseau Edge global — la latence reste sous les 100 ms partout en Tunisie.

### Redis Caching

Introduisez Redis pour mettre en cache les résultats de recherche et les menus fréquemment consultés. Cela réduit la charge sur PostgreSQL/Supabase et permet des temps de réponse sous les 50 ms.

### Rate Limiting

Implémentez un rate limiter via `express-rate-limit` :

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requêtes par fenêtre
  standardHeaders: true,
});

app.use('/api/', limiter);
```

---

## Security Best Practices

### Checklist de sécurité

**Implémenté :**

- [x] JWT avec expiration à 24 heures
- [x] Hashage des mots de passe avec bcryptjs (salt rounds: 10)
- [x] Headers HTTP sécurisés via Helmet
- [x] CORS configuré avec origines explicites
- [x] Validation des entrées avec express-validator
- [x] Variables d'environnement pour tous les secrets

**Recommandé pour la production :**

- [ ] Rate limiting sur les endpoints critiques
- [ ] HTTPS obligatoire en production
- [ ] En-têtes CSP (Content Security Policy) strictes
- [ ] Chiffrement des champs sensibles en base de données

---

## Future Roadmap

La vision pour Crêpe Time Tunisia ne s'arrête pas ici. Voici les évolutions qui transformeront l'expérience :

- **Suivi de commande en temps réel** — Intégration de Socket.io pour des mises à jour instantanées sans polling
- **Programme de fidélité** — Système de points cumulables avec récompenses et crêpes offertes
- **Internationalisation complète** — Support multilingue i18n : français, arabe et anglais
- **Paiement en ligne** — Intégration des solutions tunisiennes Flouci et Konnect pour le paiement par carte
- **Application livreur** — Application mobile dédiée aux livreurs avec géolocalisation et optimisation d'itinéraire
- **Recommandations intelligentes** — Moteur de suggestions propulsé par l'IA, basé sur l'historique de commandes

---

## Conventions de code

| Convention                | Règle                                                       |
|---------------------------|--------------------------------------------------------------|
| **TypeScript**            | Mode strict activé côté frontend et backend                  |
| **Variables / fonctions** | `camelCase` systématique                                     |
| **Composants React**      | `PascalCase`, un composant par fichier, export default       |
| **Imports**               | Alias `@/` pointant vers `src/` (configuré dans Vite)       |
| **Hooks API**             | Fichiers séparés par domaine dans `src/api/`                 |
| **Commentaires**          | Réservés à l'intention non-évidente ; le code parle de lui-même |

---

## Dépannage

### "vite n'est pas reconnu" / "nodemon n'est pas reconnu"

- **Cause :** Les dépendances n'ont pas été installées dans le dossier concerné
- **Solution :** Exécutez `npm install` dans `food-ordering-frontend/` ou `food-ordering-backend/`
- **Windows :** Après l'installation de Node.js, redémarrez complètement votre terminal (PowerShell ou CMD)

### Le backend ne démarre pas

- Vérifier que `npm install` a été exécuté dans `food-ordering-backend/`
- Vérifier que Supabase est configuré : `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` dans `.env`
- Vérifier que le schéma SQL a été exécuté dans Supabase (voir SUPABASE_SETUP.md)
- Vérifier l'existence du fichier `.env` (copier `.env.example` si nécessaire)
- Vérifier que le port 5000 n'est pas déjà occupé :
  ```bash
  netstat -an | findstr :5000
  ```

### Le frontend affiche une page blanche

- Ouvrir les DevTools (`F12`) et consulter la console JavaScript
- Vérifier que le backend est bien lancé sur le port 5000
- Vérifier que `VITE_API_BASE_URL` dans `.env` pointe vers le backend

### Les images ne s'uploadent pas

- Vérifier les identifiants Cloudinary : `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Vérifier que l'image ne dépasse pas 5 Mo

### Google OAuth ne fonctionne pas

- Vérifier les variables `GOOGLE_ID` et `GOOGLE_SECRET`
- Vérifier que l'URL de callback est bien autorisée dans Google Cloud Console :
  ```
  {BACKEND_URL}/api/auth/callback/google
  ```

### WhatsApp ne s'ouvre pas

- Vérifier que `WHATSAPP_RESTAURANT_PHONE` est au format international : `+216XXXXXXXX`
- Sur desktop, WhatsApp Web doit être connecté dans le navigateur

### Commandes utiles Windows / PowerShell

```powershell
# Copier le fichier d'environnement
Copy-Item .env.example .env

# Tuer un processus occupant un port
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess

# Redémarrer le terminal si les commandes ne sont pas reconnues
# Fermez PowerShell et rouvrez-le
```

---

© 2026 Crêpe Time Tunisia — Conçu avec passion par Marwen Rabai

*Guide technique avancé — [marwen-rabai.netlify.app](https://marwen-rabai.netlify.app)*
