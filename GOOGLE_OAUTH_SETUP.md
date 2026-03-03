# Google OAuth avec Supabase — Guide complet

> Configuration de la connexion Google pour Crêpe Time Tunisia.

---

## 1. Prérequis

- Projet Supabase créé
- Migration `002_supabase_auth.sql` exécutée
- Compte Google Cloud

---

## 2. Configuration Google Cloud Console

### 2.1 Créer un projet (si nécessaire)

1. Aller sur [console.cloud.google.com](https://console.cloud.google.com)
2. **Sélecteur de projet** → **Nouveau projet** → nommer "Crepe Time" → Créer

### 2.2 Activer l'API Google+

1. **APIs et services** → **Bibliothèque**
2. Rechercher "Google+ API" ou "Google Identity"
3. Activer **Google+ API** (ou **Google Identity Services**)

### 2.3 Créer des identifiants OAuth

1. **APIs et services** → **Identifiants**
2. **Créer des identifiants** → **ID client OAuth**
3. Type d'application : **Application Web**
4. Nom : "Crêpe Time Tunisia"
5. **URI de redirection autorisés** — ajouter **exactement** :
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
   (Remplacer `YOUR_PROJECT_REF` par l'ID de votre projet Supabase — visible dans l'URL du dashboard)
6. **Créer** → noter **ID client** et **Secret client**

---

## 3. Configuration Supabase Dashboard

### 3.1 Activer le fournisseur Google

1. Dashboard Supabase → [supabase.com/dashboard](https://supabase.com/dashboard) → votre projet
2. **Authentication** → **Providers**
3. Cliquer sur **Google** pour l'activer
4. Coller :
   - **Client ID** : (celui fourni par Google Cloud)
   - **Client Secret** : (celui fourni par Google Cloud)
5. **Save**

### 3.2 Configurer les URLs de redirection

1. **Authentication** → **URL Configuration**
2. **Site URL** :
   - Dev : `http://localhost:5173`
   - Prod : `https://votre-domaine.com`
3. **Redirect URLs** — ajouter (une par ligne) :
   ```
   http://localhost:5173/auth/callback
   http://localhost:5173/**
   https://votre-domaine.com/auth/callback
   https://votre-domaine.com/**
   ```
4. **Save**

---

## 4. Variables d'environnement

### Backend (`food-ordering-backend/.env`)

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Frontend (`food-ordering-frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## 5. Flux de connexion Google

1. L'utilisateur clique sur **Continue with Google**
2. Redirection vers Google pour la connexion
3. Google redirige vers Supabase (`/auth/v1/callback`)
4. Supabase redirige vers `redirectTo` (ex. `http://localhost:5173/auth/callback`)
5. La page `/auth/callback` récupère le code ou le token, appelle `exchangeCodeForSession` ou `getSession`
6. La session est stockée, l'utilisateur est redirigé vers `/`

---

## 6. Tests

1. Lancer backend et frontend
2. Aller sur `http://localhost:5173/sign-in`
3. Cliquer sur **Continue with Google**
4. Se connecter avec un compte Google
5. Vérifier la redirection vers la page d'accueil et la session active

---

## 7. Dépannage

### "redirect_uri_mismatch"

- Vérifier que l'URI dans Google Cloud est exactement :  
  `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- Pas d'espace, pas de slash final

### Redirection vers la page de connexion après Google (pas de session)

- **Supabase Dashboard** → **Authentication** → **URL Configuration**
- **Redirect URLs** : ajouter **exactement** :
  - `http://localhost:5173/auth/callback` (dev)
  - `https://votre-domaine.com/auth/callback` (prod)
- Si l'URL n'est pas dans la liste, Supabase redirige vers la Site URL et la session est perdue

### "PKCE code verifier not found in storage"

- Le projet utilise le **flux implicite** (`flowType: "implicit"`) pour éviter cette erreur
- Les tokens sont renvoyés dans le hash de l'URL (`#access_token=...`) — pas de code_verifier requis
- Si vous voyez encore cette erreur, vérifiez que `flowType: "implicit"` est bien défini dans `lib/supabase.ts`

### "Invalid OAuth client"

- Vérifier Client ID et Client Secret dans Supabase
- Vérifier que l'API Google+ / Identity est activée

### La session ne persiste pas

- Vérifier `detectSessionInUrl: true` dans le client Supabase
- Vérifier que les Redirect URLs incluent `/auth/callback`

### CORS

- Le backend doit autoriser l'origine du frontend dans CORS
- Vérifier `FRONTEND_URL` dans le backend `.env`

---

## 8. Production

Pour la production :

1. Ajouter l'URL de prod dans **Redirect URLs** (Supabase)
2. Mettre à jour **Site URL** dans Supabase
3. Définir `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans Vercel
4. Dans Google Cloud, ajouter l'origine de prod si nécessaire
