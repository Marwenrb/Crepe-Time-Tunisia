import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "react-query";
import * as authApi from "@/api/authApi";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import LeftPanel  from "@/components/auth/LeftPanel";
import MobileHero from "@/components/auth/MobileHero";
import AuthInput  from "@/components/ui/AuthInput";
import AuthButton from "@/components/ui/AuthButton";

/* ── Google icon (official colours) ──────────────────────────── */
const GoogleIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

/* ── Validation ───────────────────────────────────────────────── */
const signInSchema = z.object({
  email:    z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

/* ── Page ─────────────────────────────────────────────────────── */
const SignInPage = () => {
  const navigate     = useNavigate();
  const location     = useLocation();
  const queryClient  = useQueryClient();
  const [isLoading,       setIsLoading]       = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword,    setShowPassword]    = useState(false);

  /* ── Google OAuth ─────────────────────────────────────────── */
  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options:  { redirectTo: `${window.location.origin}/` },
      });
      if (error) throw error;
    } catch {
      toast.error("Connexion Google échouée. Réessayez.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  /* ── Form ─────────────────────────────────────────────────── */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver:      zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: SignInFormValues) => {
    setIsLoading(true);
    try {
      await authApi.signIn(data);
      await queryClient.invalidateQueries("validateToken");
      toast.success("Connexion réussie !");
      navigate(
        (location.state as { from?: { pathname: string } })?.from?.pathname || "/"
      );
      window.location.reload();
    } catch (err: unknown) {
      const ax = err as { message?: string };
      toast.error(ax.message || "Email ou mot de passe incorrect");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Render ───────────────────────────────────────────────── */
  return (
    /* AuthBackground is mounted in AuthLayout — not rendered here */
    <div className="w-full flex flex-col md:flex-row md:min-h-[100dvh]">

      {/* ── Desktop branding panel (42%) ──────────────────────── */}
      <LeftPanel variant="signin" />

      {/* ── Mobile atmospheric strip ──────────────────────────── */}
      <MobileHero />

      {/* ── Form panel ────────────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col items-center justify-start md:justify-center px-6 pt-10 pb-10 md:py-0 md:min-h-[100dvh]"
        style={{
          background: "radial-gradient(ellipse 90% 50% at 50% 0%, rgba(76,29,149,0.11) 0%, transparent 70%)",
        }}
      >
        <div
          className="w-full"
          style={{ maxWidth: 380 }}
          aria-label="Formulaire de connexion"
        >
          {/* ── Page heading ────────────────────────────────── */}
          <div className="ct-field-1" style={{ marginBottom: 28 }}>
            <h1
              style={{
                fontFamily:    "var(--font-luxury, 'Cormorant Garamond', Georgia, serif)",
                fontSize:      "clamp(36px, 5vw, 48px)",
                fontWeight:    300,
                letterSpacing: "0.02em",
                color:         "#E5C76B",
                lineHeight:    1.1,
                margin:        0,
              }}
            >
              Bon retour
            </h1>
            <p
              style={{
                fontFamily:    "var(--font-ui, 'Jost', sans-serif)",
                fontSize:      13,
                fontWeight:    400,
                color:         "rgba(255,255,255,0.38)",
                marginTop:     8,
                letterSpacing: "0.04em",
                lineHeight:    1.5,
              }}
            >
              Connectez-vous pour commander
            </p>
          </div>

          {/* ── Form ──────────────────────────────────────────── */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
            aria-busy={isLoading}
            className="flex flex-col gap-4"
          >

            {/* Google OAuth */}
            <div className="ct-field-2">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                aria-label="Continuer avec Google"
                className="flex items-center justify-center gap-2.5 w-full transition-all duration-200 focus-visible:outline-none"
                style={{
                  background:   "rgba(255,255,255,0.03)",
                  border:       "1px solid rgba(212,175,55,0.28)",
                  borderRadius: 10,
                  minHeight:    48,
                  fontFamily:   "var(--font-ui, 'Jost', sans-serif)",
                  fontSize:     14,
                  fontWeight:   400,
                  color:        "rgba(255,255,255,0.65)",
                  letterSpacing:"0.03em",
                  cursor:       "pointer",
                  padding:      "0 20px",
                }}
                onMouseEnter={(e) => {
                  const t = e.currentTarget;
                  t.style.background   = "rgba(212,175,55,0.07)";
                  t.style.borderColor  = "rgba(212,175,55,0.58)";
                  t.style.color        = "rgba(255,255,255,0.85)";
                }}
                onMouseLeave={(e) => {
                  const t = e.currentTarget;
                  t.style.background   = "rgba(255,255,255,0.03)";
                  t.style.borderColor  = "rgba(212,175,55,0.28)";
                  t.style.color        = "rgba(255,255,255,0.65)";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline       = "2px solid rgba(212,175,55,0.4)";
                  e.currentTarget.style.outlineOffset = "2px";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = "none";
                }}
              >
                {isGoogleLoading
                  ? <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  : <GoogleIcon />}
                Continuer avec Google
              </button>
            </div>

            {/* Divider — ou — */}
            <div className="flex items-center gap-3 ct-field-3">
              <div
                className="flex-1 h-px"
                style={{ background: "rgba(212,175,55,0.18)" }}
              />
              <span
                style={{
                  fontFamily:    "var(--font-ui, 'Jost', sans-serif)",
                  fontSize:      11,
                  color:         "rgba(212,175,55,0.40)",
                  letterSpacing: "0.14em",
                  fontWeight:    400,
                  userSelect:    "none",
                }}
              >
                ou
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: "rgba(212,175,55,0.18)" }}
              />
            </div>

            {/* Email */}
            <div className="ct-field-4">
              <AuthInput
                id="email"
                type="email"
                label="Adresse email"
                icon={<Mail size={16} />}
                error={errors.email?.message}
                autoComplete="email"
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
              />
            </div>

            {/* Password */}
            <div className="ct-field-5">
              <AuthInput
                id="password"
                type={showPassword ? "text" : "password"}
                label="Mot de passe"
                icon={<Lock size={16} />}
                error={errors.password?.message}
                autoComplete="current-password"
                aria-describedby={errors.password ? "password-error" : undefined}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    style={{
                      background:     "none",
                      border:         "none",
                      cursor:         "pointer",
                      color:          "rgba(212,175,55,0.45)",
                      padding:        "4px",
                      display:        "flex",
                      alignItems:     "center",
                      minWidth:       44,
                      minHeight:      44,
                      justifyContent: "center",
                      transition:     "color 160ms ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = "rgba(212,175,55,0.85)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = "rgba(212,175,55,0.45)";
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                {...register("password")}
              />
            </div>

            {/* Forgot password */}
            <div className="text-right -mt-1 ct-field-6">
              <Link
                to="/sign-in"
                style={{
                  fontFamily:     "var(--font-ui, 'Jost', sans-serif)",
                  fontSize:       12,
                  color:          "rgba(212,175,55,0.50)",
                  letterSpacing:  "0.04em",
                  textDecoration: "none",
                  transition:     "color 160ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(212,175,55,0.85)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(212,175,55,0.50)";
                }}
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Submit */}
            <div className="ct-field-7">
              <AuthButton loading={isLoading}>
                {isLoading ? "Connexion…" : "Se connecter"}
              </AuthButton>
            </div>

            {/* Switch to register */}
            <p
              className="text-center"
              style={{
                fontFamily:    "var(--font-ui, 'Jost', sans-serif)",
                fontSize:      13,
                color:         "rgba(255,255,255,0.38)",
                letterSpacing: "0.02em",
              }}
            >
              Nouveau sur Crêpe Time ?{" "}
              <Link
                to="/register"
                style={{
                  color:          "#D4AF37",
                  fontWeight:     500,
                  textDecoration: "none",
                  transition:     "color 160ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#E5C76B";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#D4AF37";
                }}
              >
                Créer un compte
              </Link>
            </p>

          </form>
        </div>
      </div>

    </div>
  );
};

export default SignInPage;
