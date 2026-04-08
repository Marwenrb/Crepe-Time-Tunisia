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
import GlowCard   from "@/components/auth/GlowCard";
import AuthInput  from "@/components/ui/AuthInput";
import AuthButton from "@/components/ui/AuthButton";

/* ─── Google icon ─────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

/* ─── Validation ──────────────────────────────────────────── */
const signInSchema = z.object({
  email:    z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

/* ─── Page ────────────────────────────────────────────────── */
const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [isLoading,        setIsLoading]        = useState(false);
  const [isGoogleLoading,  setIsGoogleLoading]  = useState(false);
  const [showPassword,     setShowPassword]     = useState(false);

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

  return (
    /* AuthBackground is mounted in AuthLayout — not rendered here */
    <div className="w-full flex min-h-[100dvh]">

      {/* Desktop left branding panel */}
      <LeftPanel variant="signin" />

      {/* Form panel — start-aligned on mobile so tall forms scroll naturally */}
      <div className="flex flex-col items-center justify-start md:justify-center w-full md:w-1/2 min-h-[100dvh] px-5 pt-7 pb-6">

        {/* Mobile hero (typing effect) — hidden on desktop */}
        <div className="md:hidden w-full max-w-sm mb-5">
          <MobileHero
            lines={["La douceur", "commence ici."]}
            subtitle="Commandez vos crêpes artisanales en quelques secondes."
          />
        </div>

        {/* Glow-border form card */}
        <div className="w-full max-w-sm">
          <GlowCard>
            <form
              onSubmit={handleSubmit(onSubmit)}
              autoComplete="off"
              aria-busy={isLoading}
              className="flex flex-col gap-4 sm:gap-5"
            >

              {/* Heading — shown on desktop only (MobileHero covers mobile) */}
              <div className="hidden md:block text-center ct-field-1">
                <h1
                  style={{
                    fontFamily:    "var(--font-display, 'Syne', sans-serif)",
                    fontSize:      22,
                    fontWeight:    700,
                    letterSpacing: "-0.02em",
                    color:         "#FAFAFA",
                    lineHeight:    1.2,
                  }}
                >
                  Bon retour
                </h1>
                <p
                  style={{
                    fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                    fontSize:   13,
                    color:      "#6B6B8A",
                    marginTop:  4,
                  }}
                >
                  Connectez-vous à votre compte
                </p>
              </div>

              {/* Google OAuth */}
              <div className="ct-field-2">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  className="flex items-center justify-center gap-2.5 w-full min-h-[44px] rounded-xl border transition-all duration-200 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background:  "rgba(26,26,56,0.6)",
                    borderColor: "rgba(139,92,246,0.18)",
                    color:       "#C4C4D4",
                    fontFamily:  "var(--font-body, 'DM Sans', sans-serif)",
                  }}
                  onMouseEnter={(e) => {
                    const t = e.currentTarget;
                    t.style.borderColor = "rgba(139,92,246,0.45)";
                    t.style.background  = "rgba(91,33,182,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    const t = e.currentTarget;
                    t.style.borderColor = "rgba(139,92,246,0.18)";
                    t.style.background  = "rgba(26,26,56,0.6)";
                  }}
                >
                  {isGoogleLoading
                    ? <Loader2 size={16} className="animate-spin" />
                    : <GoogleIcon />}
                  Continuer avec Google
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 ct-field-3">
                <div className="flex-1 h-px" style={{ background: "rgba(139,92,246,0.12)" }} />
                <span
                  style={{
                    fontFamily:    "var(--font-body)",
                    fontSize:      11,
                    color:         "#3A3A55",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  ou email
                </span>
                <div className="flex-1 h-px" style={{ background: "rgba(139,92,246,0.12)" }} />
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
                        color:          "#6B6B8A",
                        padding:        "4px",
                        display:        "flex",
                        alignItems:     "center",
                        minWidth:       44,
                        minHeight:      44,
                        justifyContent: "center",
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  {...register("password")}
                />
              </div>

              {/* Forgot password */}
              <div className="text-right -mt-2 ct-field-6">
                <Link
                  to="/sign-in"
                  style={{
                    fontFamily:     "var(--font-body, 'DM Sans', sans-serif)",
                    fontSize:       12,
                    color:          "rgba(139,92,246,0.6)",
                    letterSpacing:  "0.02em",
                    textDecoration: "none",
                    transition:     "color 150ms ease",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#8B5CF6"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(139,92,246,0.6)"; }}
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Submit */}
              <div className="ct-field-7">
                <AuthButton loading={isLoading}>
                  {isLoading ? "Connexion…" : "Connexion"}
                </AuthButton>
              </div>

              {/* Switch */}
              <p
                className="text-center"
                style={{
                  fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                  fontSize:   13,
                  color:      "#6B6B8A",
                }}
              >
                Nouveau sur Crêpe Time ?{" "}
                <Link to="/register" style={{ color: "#8B5CF6", fontWeight: 600, textDecoration: "none" }}>
                  Créer un compte
                </Link>
              </p>

            </form>
          </GlowCard>
        </div>

        {/* Safe-area bottom padding */}
        <div style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }} />
      </div>
    </div>
  );
};

export default SignInPage;
