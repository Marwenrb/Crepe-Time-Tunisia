# 🔔 Notification Nirvana — Supabase Realtime + Email

> Crêpe Time Tunisia — Realtime push admin + emails clients auto via Resend.  
> Système 100% opérationnel, premium, zéro-bug.

---

## Vue d'ensemble

| Fonctionnalité | Technologie | Déclencheur |
|----------------|-------------|-------------|
| **Dashboard admin** | Supabase Realtime | postgres_changes sur `orders` |
| **Emails clients** | Edge Function + Resend | Database Webhook sur `orders` INSERT/UPDATE |

---

## 1. Configuration rapide (clé en main)

### Étape 1 : Migration SQL

Exécuter dans **Supabase SQL Editor** :

```sql
-- Fichier : supabase/migrations/003_realtime_and_email_logs.sql
```

Ou copier-coller le contenu de `003_realtime_and_email_logs.sql`.

### Étape 2 : Secrets Supabase

```bash
# Lier le projet (une fois)
supabase link --project-ref VOTRE_PROJECT_REF

# Définir les secrets avec la clé Resend (remplacer par votre clé si différente)
supabase secrets set RESEND_API_KEY=re_RsP4yV6h_4ohUx8EZM9pHnVoT92YZ1mHH
supabase secrets set FRONTEND_URL=http://localhost:5173
```

**Production :** remplacer `FRONTEND_URL` par l'URL Vercel :

```bash
supabase secrets set FRONTEND_URL=https://crepe-time.vercel.app
```

### Étape 3 : Déployer l'Edge Function

```bash
supabase functions deploy notify-client
```

### Étape 4 : Database Webhook

1. **Supabase Dashboard** → **Database** → **Webhooks**
2. **Create a new webhook**
3. **Name** : `notify-client-on-orders`
4. **Table** : `orders`
5. **Events** : `Insert`, `Update`
6. **Type** : `Supabase Edge Function`
7. **Function** : `notify-client`
8. **Save**

---

## 2. Realtime — Dashboard admin

### Comportement

- Admin sur `/manage-restaurant` → abonnement Realtime sur `orders` filtré par `restaurant_id`
- **INSERT** → toast "Nouvelle commande !" 🍪 + son (si `prefers-reduced-motion` désactivé) + refetch
- **UPDATE** → toast "Commande mise à jour" + refetch

### Fichiers

- `src/hooks/useOrdersRealtime.tsx` — hook Realtime
- `ManageRestaurantPage.tsx` — intégration

### Respect accessibilité

- `prefers-reduced-motion: reduce` → son désactivé automatiquement

---

## 3. Emails clients — Resend

### Contenu

- **Confirmation** (INSERT) : "🍪 Commande reçue !" — HTML violet/or, bilingue FR/AR
- **Mise à jour** (UPDATE) : "📦 Mise à jour de votre commande" — nouveau statut + lien

### Sécurité

- **Rate limiting** : max 3 emails par commande par minute
- **Erreurs** → log dans `email_logs` (status: `failed`, `error_message`)
- **Succès** → log dans `email_logs` (status: `sent`)

### Variables requises

| Secret | Obligatoire | Description |
|-------|-------------|-------------|
| `RESEND_API_KEY` | ✅ | Clé API Resend (`re_...`) |
| `FRONTEND_URL` | ⚠️ | URL frontend pour lien `/order-status` (défaut: localhost) |

---

## 4. Tests en live

### Test Realtime

1. Ouvrir 2 onglets : admin (`/manage-restaurant`) + client (menu)
2. Passer une commande en tant que client
3. **Résultat attendu** : toast "Nouvelle commande !" 🍪 + son + nouvelle commande dans la liste admin

### Test Email

1. Passer une commande avec un **email valide** dans les coordonnées
2. Vérifier la boîte de réception (et spam)
3. **Résultat attendu** : email "🧇 Crêpe Time — Commande reçue #xxxxxx"
4. Mettre à jour le statut en admin → client reçoit un 2ᵉ email

### Vérifier les logs

```sql
SELECT * FROM email_logs ORDER BY created_at DESC LIMIT 20;
```

---

## 5. Commandes terminal exactes

```bash
# 1. Lier le projet Supabase
supabase link --project-ref VOTRE_PROJECT_REF

# 2. Secrets (clé Resend fournie)
supabase secrets set RESEND_API_KEY=re_RsP4yV6h_4ohUx8EZM9pHnVoT92YZ1mHH
supabase secrets set FRONTEND_URL=http://localhost:5173

# 3. Déployer la fonction
supabase functions deploy notify-client

# 4. Vérifier les secrets
supabase secrets list
```

---

## 6. Déploiement production

| Plateforme | Variable | Valeur |
|------------|----------|--------|
| **Vercel** | `VITE_SUPABASE_URL` | `https://xxx.supabase.co` |
| **Vercel** | `VITE_SUPABASE_ANON_KEY` | Clé anon |
| **Supabase** | `FRONTEND_URL` | `https://votre-app.vercel.app` |

---

## 7. Dépannage

| Problème | Solution |
|----------|----------|
| Pas de toast Realtime | Vérifier `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans le frontend |
| Pas d'email | Vérifier que l'email est renseigné dans la commande (guest ou user) |
| `RESEND_API_KEY not configured` | Exécuter `supabase secrets set RESEND_API_KEY=...` |
| Webhook non déclenché | Vérifier Database → Webhooks → `notify-client-on-orders` |

---

*Ignite real-time crepe conquests with Supabase's notification nirvana! 🚀🍪*
