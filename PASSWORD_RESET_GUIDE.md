# PASSWORD RESET — Developer Implementation Guide
### Crêpe Time Tunisia · Supabase Auth Password Recovery Flow

> **Last updated:** April 6, 2026
> **Status:** NOT YET IMPLEMENTED — this guide covers exactly what to build
> **Auth provider:** Supabase Auth (implicit flow, email/password + Google OAuth)

---

## TABLE OF CONTENTS

1. [Current State](#1-current-state)
2. [Architecture Overview](#2-architecture-overview)
3. [Supabase Configuration (Dashboard)](#3-supabase-configuration-dashboard)
4. [Frontend Implementation](#4-frontend-implementation)
5. [File Changes Summary](#5-file-changes-summary)
6. [Testing Checklist](#6-testing-checklist)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. CURRENT STATE

| Component | Status |
|-----------|--------|
| SignInPage "Forgot Password" link | ⚠️ Exists but links to `#` (disabled) |
| `/forgot-password` page | ❌ Not built |
| `/reset-password` page | ❌ Not built |
| Routes in `AppRoutes.tsx` | ❌ Not registered |
| API functions in `authApi.ts` | ❌ Not created |
| Backend endpoints | ✅ **Not needed** — Supabase handles everything |
| Email infrastructure (Resend) | ✅ Ready — used for order emails |
| Supabase Auth config | ✅ Configured (implicit flow) |

**Key files involved:**

| File | Role |
|------|------|
| `food-ordering-frontend/src/api/authApi.ts` | Add `requestPasswordReset()` + `updatePassword()` |
| `food-ordering-frontend/src/pages/SignInPage.tsx` | Fix "Forgot Password" link → `/forgot-password` |
| `food-ordering-frontend/src/pages/ForgotPasswordPage.tsx` | **NEW** — email input form |
| `food-ordering-frontend/src/pages/ResetPasswordPage.tsx` | **NEW** — new password form |
| `food-ordering-frontend/src/AppRoutes.tsx` | Register 2 new routes |
| `food-ordering-frontend/src/lib/supabase.ts` | No changes needed |

---

## 2. ARCHITECTURE OVERVIEW

```
USER FLOW
─────────

1. User clicks "Forgot Password" on /sign-in
   └──▶ /forgot-password (email form)

2. User submits email
   └──▶ supabase.auth.resetPasswordForEmail(email, { redirectTo })
   └──▶ Supabase sends password reset email with magic link

3. User clicks link in email
   └──▶ Supabase redirects to: https://crepetime.tn/reset-password#access_token=...&type=recovery

4. /reset-password page extracts token from URL hash
   └──▶ supabase.auth.setSession({ access_token, refresh_token })
   └──▶ User enters new password
   └──▶ supabase.auth.updateUser({ password: newPassword })

5. Success → redirect to /sign-in with success message
```

**Important:** The `implicit` flow type (configured in `src/lib/supabase.ts`) means Supabase puts tokens in the URL hash (`#access_token=...`), not as query params. The `AuthCallbackPage.tsx` already handles this pattern — the reset page should do the same.

---

## 3. SUPABASE CONFIGURATION (Dashboard)

### 3.1 Email Template

1. Go to **Supabase Dashboard** → **Authentication** → **Email Templates**
2. Select **"Reset Password"** template
3. Configure:

| Setting | Value |
|---------|-------|
| Subject | `Crêpe Time — Réinitialisation de votre mot de passe` |
| Redirect URL | `https://crepetime.tn/reset-password` |

**Recommended HTML template:**

```html
<h2 style="color: #4C1D95; font-family: Georgia, serif;">Crêpe Time</h2>
<p>Bonjour,</p>
<p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
<p>Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :</p>
<a href="{{ .ConfirmationURL }}"
   style="display: inline-block; padding: 12px 32px; background: #4C1D95;
          color: #D4AF37; border-radius: 8px; text-decoration: none;
          font-weight: bold; font-family: Arial, sans-serif;">
  Réinitialiser mon mot de passe
</a>
<p style="color: #666; font-size: 13px; margin-top: 24px;">
  Ce lien expire dans 24 heures. Si vous n'avez pas fait cette demande, ignorez cet email.
</p>
<hr style="border: none; border-top: 1px solid #D4AF37; margin: 24px 0;" />
<p style="color: #999; font-size: 12px;">Crêpe Time Tunisia — The Sweetest Escape</p>
```

### 3.2 Auth Settings

1. Go to **Authentication** → **URL Configuration**
2. Add to **Redirect URLs**:
   - `https://crepetime.tn/reset-password`
   - `http://localhost:5173/reset-password` (for local dev)

### 3.3 Rate Limiting

Supabase has built-in rate limiting for password reset emails:
- Default: **30 emails per hour per IP**
- Configurable in Dashboard → **Auth** → **Rate Limits**

---

## 4. FRONTEND IMPLEMENTATION

### 4.1 API Functions — `authApi.ts`

Add these two functions to `food-ordering-frontend/src/api/authApi.ts`:

```typescript
/**
 * Send a password reset email via Supabase.
 * Supabase will email a link that redirects to /reset-password with tokens in the hash.
 */
export const requestPasswordReset = async (email: string): Promise<void> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
};

/**
 * Update the user's password after they've clicked the reset link.
 * Must be called AFTER the session is established from the reset token.
 */
export const updatePassword = async (newPassword: string): Promise<void> => {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
};
```

### 4.2 Forgot Password Page — `ForgotPasswordPage.tsx`

Create `food-ordering-frontend/src/pages/ForgotPasswordPage.tsx`:

```tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "@/api/authApi";
import { toast } from "sonner";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import AuthBrandPanel from "@/components/AuthBrandPanel";

const schema = z.object({
  email: z.string().email("Adresse email invalide"),
});

type FormData = z.infer<typeof schema>;

const ForgotPasswordPage = () => {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await requestPasswordReset(data.email);
      setSent(true);
      toast.success("Email envoyé !");
    } catch {
      // Don't reveal if email exists or not (security)
      setSent(true);
      toast.success("Email envoyé !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh]">
      <AuthBrandPanel />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          {!sent ? (
            <>
              <div className="text-center space-y-2">
                <Mail className="w-12 h-12 mx-auto text-crepe-gold" />
                <h1 className="text-2xl font-bold text-white">Mot de passe oublié</h1>
                <p className="text-white/60 text-sm">
                  Entrez votre adresse email. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    aria-label="Email"
                    autoComplete="email"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20
                               text-white placeholder:text-white/40 focus:outline-none
                               focus:ring-2 focus:ring-crepe-gold/50"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-crepe-gold text-crepe-dark font-semibold
                             hover:bg-crepe-gold/90 transition-colors disabled:opacity-50
                             flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Envoyer le lien
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 mx-auto text-green-400" />
              <h2 className="text-xl font-bold text-white">Email envoyé !</h2>
              <p className="text-white/60 text-sm">
                Si un compte existe avec cette adresse, vous recevrez un email avec un lien
                de réinitialisation. Vérifiez vos spams si nécessaire.
              </p>
            </div>
          )}
          <Link
            to="/sign-in"
            className="flex items-center justify-center gap-2 text-sm text-white/50
                       hover:text-crepe-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
```

### 4.3 Reset Password Page — `ResetPasswordPage.tsx`

Create `food-ordering-frontend/src/pages/ResetPasswordPage.tsx`:

```tsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { updatePassword } from "@/api/authApi";
import { toast } from "sonner";
import { Lock, Loader2, ShieldCheck } from "lucide-react";
import AuthBrandPanel from "@/components/AuthBrandPanel";

const schema = z.object({
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // Extract access_token + refresh_token from URL hash (implicit flow)
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type");

    if (type !== "recovery" || !accessToken || !refreshToken) {
      setError("Lien de réinitialisation invalide ou expiré.");
      return;
    }

    supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error: sessionError }) => {
        if (sessionError) {
          setError("Session expirée. Demandez un nouveau lien.");
        } else {
          setReady(true);
        }
      });
  }, []);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await updatePassword(data.password);
      toast.success("Mot de passe mis à jour !");
      // Sign out so user logs in with new password
      await supabase.auth.signOut();
      navigate("/sign-in?reset=success");
    } catch (err) {
      toast.error("Échec de la mise à jour. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh]">
      <AuthBrandPanel />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          {error ? (
            <div className="text-center space-y-4">
              <ShieldCheck className="w-16 h-16 mx-auto text-red-400" />
              <h2 className="text-xl font-bold text-white">Lien expiré</h2>
              <p className="text-white/60 text-sm">{error}</p>
              <a href="/forgot-password"
                 className="inline-block mt-4 px-6 py-2 rounded-lg bg-crepe-gold
                            text-crepe-dark font-semibold hover:bg-crepe-gold/90
                            transition-colors">
                Demander un nouveau lien
              </a>
            </div>
          ) : ready ? (
            <>
              <div className="text-center space-y-2">
                <Lock className="w-12 h-12 mx-auto text-crepe-gold" />
                <h1 className="text-2xl font-bold text-white">Nouveau mot de passe</h1>
                <p className="text-white/60 text-sm">
                  Choisissez un nouveau mot de passe pour votre compte.
                </p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <input
                    type="password"
                    placeholder="Nouveau mot de passe"
                    aria-label="Nouveau mot de passe"
                    autoComplete="new-password"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20
                               text-white placeholder:text-white/40 focus:outline-none
                               focus:ring-2 focus:ring-crepe-gold/50"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
                  )}
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    aria-label="Confirmer le mot de passe"
                    autoComplete="new-password"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20
                               text-white placeholder:text-white/40 focus:outline-none
                               focus:ring-2 focus:ring-crepe-gold/50"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-crepe-gold text-crepe-dark font-semibold
                             hover:bg-crepe-gold/90 transition-colors disabled:opacity-50
                             flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Mettre à jour
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-crepe-gold" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
```

### 4.4 Routes — `AppRoutes.tsx`

Add these lazy imports at the top:

```typescript
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
```

Add these routes (after the `/register` route):

```tsx
<Route
  path="/forgot-password"
  element={
    <Layout showHero={false}>
      <Lazy><ForgotPasswordPage /></Lazy>
    </Layout>
  }
/>
<Route
  path="/reset-password"
  element={
    <Layout showHero={false}>
      <Lazy><ResetPasswordPage /></Lazy>
    </Layout>
  }
/>
```

### 4.5 Fix SignInPage Link

In `food-ordering-frontend/src/pages/SignInPage.tsx`, change:

```tsx
// BEFORE (disabled):
<Link to="#" className="...">Forgot Password</Link>

// AFTER (active):
<Link to="/forgot-password" className="...">Mot de passe oublié ?</Link>
```

---

## 5. FILE CHANGES SUMMARY

| File | Action | Lines |
|------|--------|-------|
| `src/api/authApi.ts` | **EDIT** — add 2 functions | +15 |
| `src/pages/ForgotPasswordPage.tsx` | **NEW** | ~90 |
| `src/pages/ResetPasswordPage.tsx` | **NEW** | ~120 |
| `src/AppRoutes.tsx` | **EDIT** — add 2 imports + 2 routes | +16 |
| `src/pages/SignInPage.tsx` | **EDIT** — fix link href + text | +1 |
| Backend | **NONE** | 0 |

**Total: ~240 lines of new code, 0 backend changes.**

---

## 6. TESTING CHECKLIST

### 6.1 Happy Path
- [ ] Click "Mot de passe oublié ?" on sign-in page → navigates to `/forgot-password`
- [ ] Enter a valid registered email → shows success message
- [ ] Check email inbox → Crêpe Time branded reset email received
- [ ] Click reset link in email → opens `/reset-password` with form
- [ ] Enter new password + confirm → success toast → redirected to `/sign-in`
- [ ] Sign in with new password → works

### 6.2 Error Cases
- [ ] Enter non-existent email → same success message (no email enumeration)
- [ ] Open `/reset-password` without hash tokens → shows "Lien expiré" error
- [ ] Open expired reset link (>24h) → shows "Session expirée" error
- [ ] Mismatched passwords → shows validation error
- [ ] Password < 6 chars → shows validation error
- [ ] Submit empty email → shows validation error

### 6.3 Security
- [ ] Password reset doesn't reveal whether email exists (always shows success)
- [ ] Reset link expires after 24 hours
- [ ] Old password stops working after reset
- [ ] Session is signed out after password change (forces re-login)
- [ ] Rate limiting active (check Supabase dashboard)

### 6.4 Edge Cases
- [ ] User clicks reset link twice → second time shows error
- [ ] User requests multiple reset emails → only latest link works
- [ ] Gmail "+" aliases work (user+test@gmail.com)
- [ ] Try reset on Google OAuth account (should still work — Supabase allows both)

---

## 7. TROUBLESHOOTING

### "Lien de réinitialisation invalide ou expiré"
- **Cause:** URL hash doesn't contain `type=recovery` or tokens are missing
- **Fix:** Ensure Supabase redirect URL is `https://crepetime.tn/reset-password`
- **Check:** URL should look like `/reset-password#access_token=xxx&refresh_token=xxx&type=recovery`

### Email not received
- Check **Supabase Dashboard → Authentication → Email Logs**
- Check spam/junk folder
- Verify Supabase email provider is configured (default: Supabase built-in SMTP)
- For production: configure custom SMTP or Resend in Supabase dashboard

### "AuthPKCECodeVerifierMissingError"
- **Cause:** This project uses `implicit` flow (not PKCE)
- **Fix:** Already handled — `flowType: "implicit"` is set in `src/lib/supabase.ts`

### Token works in dev but not production
- **Cause:** Redirect URL mismatch
- **Fix:** Add both URLs in Supabase Dashboard → Authentication → URL Configuration:
  - `http://localhost:5173/reset-password`
  - `https://crepetime.tn/reset-password`

### User can't set password (Google OAuth only account)
- Supabase allows adding a password to an OAuth account via `updateUser()`
- This is expected behavior — the user will then have both login methods
