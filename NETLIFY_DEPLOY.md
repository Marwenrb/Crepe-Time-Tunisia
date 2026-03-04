# Netlify + Supabase + Render (Production)

This project needs 3 running parts in production:

1. `food-ordering-frontend` on Netlify
2. `food-ordering-backend` on Render (or any Node host)
3. Supabase project (Auth + Postgres)

If the backend is not deployed, frontend requests fail with `ERR_CONNECTION_REFUSED` on `localhost:5000`.

## 1) Supabase setup

Run migrations in Supabase SQL Editor, in this order:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_supabase_auth.sql`
3. `supabase/migrations/003_realtime_and_email_logs.sql`

Then seed initial data from this repo:

```powershell
npm run seed
```

Expected result: admin user + default restaurant in `Nabeul`.

## 2) Backend deploy (Render)

Deploy `food-ordering-backend` as a Web Service.

Build command:

```bash
npm install && npm run build
```

Start command:

```bash
npm start
```

Required env vars on backend:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET_KEY`
- `FRONTEND_URL=https://crepetime.netlify.app`
- `BACKEND_URL=https://<your-render-api-domain>`
- `CLOUDINARY_*` (if image upload is used)

After deploy, verify:

- `https://<your-render-api-domain>/health`

## 3) Frontend deploy (Netlify)

In Netlify, set environment variables:

- `VITE_API_BASE_URL=https://<your-render-api-domain>`
- `VITE_SUPABASE_URL=https://kjhuwmbddxuyrtycdezr.supabase.co`
- `VITE_SUPABASE_ANON_KEY=<your anon public key>`
- `VITE_APP_URL=https://crepetime.netlify.app`

Then redeploy the site.

Note: frontend build now fails if `VITE_API_BASE_URL` is missing or points to localhost in production.

## 4) Supabase Auth URLs (fix Google login redirect)

In Supabase Dashboard > Authentication > URL Configuration:

- `Site URL`: `https://crepetime.netlify.app`
- `Redirect URLs`: `https://crepetime.netlify.app/auth/callback`

If Google OAuth still redirects to localhost, this section is not configured correctly.

## 5) Quick verification

1. Open `https://crepetime.netlify.app/menu` and confirm it redirects to restaurant details.
2. Sign in with admin and verify `/manage-restaurant` opens.
3. Test Google login, verify callback is `https://crepetime.netlify.app/auth/callback`.
4. Open Netlify browser devtools and confirm no request goes to `localhost:5000`.
