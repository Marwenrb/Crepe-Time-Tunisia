import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "react-query";
import * as authApi from "@/api/authApi";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import AuthInput    from "@/components/ui/AuthInput";
import AuthButton   from "@/components/ui/AuthButton";
import AuthFormCard from "@/components/auth/AuthFormCard";

/* ── 2-line typewriter hook (StrictMode-safe) ────────────────── */
function use2LineTypewriter(line1: string, line2: string) {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [phase, setPhase] = useState<"line1" | "line2" | "done">("line1");
  const cancelRef = useRef(false);

  useEffect(() => {
    cancelRef.current = false;
    setText1(""); setText2(""); setPhase("line1");

    const type = (
      full: string,
      setter: (s: string) => void,
      startDelay: number,
      onDone: () => void,
    ) => {
      const tid = setTimeout(() => {
        let i = 0;
        const tick = () => {
          if (cancelRef.current) return;
          i++;
          setter(full.slice(0, i));
          if (i < full.length) setTimeout(tick, 52);
          else onDone();
        };
        tick();
      }, startDelay);
      return tid;
    };

    const t1 = type(line1, setText1, 320, () => {
      if (cancelRef.current) return;
      setPhase("line2");
      type(line2, setText2, 260, () => {
        if (!cancelRef.current) setPhase("done");
      });
    });

    return () => { cancelRef.current = true; clearTimeout(t1); };
  }, [line1, line2]);

  return { text1, text2, phase };
}

/* ── Google icon ──────────────────────────────────────────────── */
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

  const { text1, text2, phase } = use2LineTypewriter(
    "Bon retour",
    "Connectez-vous pour commander",
  );

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

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-14"
      style={{ minHeight: "100dvh" }}
    >
      <div className="w-full" style={{ maxWidth: 420 }}>

        {/* ── Typewriter heading ─────────────────────────────── */}
        <div className="text-center ct-field-1" style={{ marginBottom: 28 }}>
          <h1
            aria-label="Bon retour"
            style={{
              fontFamily:    "var(--font-luxury, 'Cormorant Garamond', Georgia, serif)",
              fontSize:      "clamp(36px, 9vw, 56px)",
              fontWeight:    300,
              letterSpacing: "0.02em",
              color:         "#E5C76B",
              lineHeight:    1.05,
              margin:        0,
              minHeight:     "1.15em",
            }}
          >
            {text1}
            {phase === "line1" && <span className="ct-tw-cursor">|</span>}
          </h1>

          <p
            aria-label="Connectez-vous pour commander"
            style={{
              fontFamily:    "var(--font-ui, 'Jost', sans-serif)",
              fontSize:      "clamp(12px, 3.2vw, 14px)",
              fontStyle:     "italic",
              color:         "rgba(255,255,255,0.35)",
              marginTop:     10,
              letterSpacing: "0.06em",
              lineHeight:    1.5,
              minHeight:     "1.5em",
            }}
          >
            {text2}
            {phase === "line2" && <span className="ct-tw-cursor">|</span>}
          </p>
        </div>

        {/* ── UIverse spinning-border card ─────────────────── */}
        <AuthFormCard>
          <form
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
            aria-busy={isLoading}
            aria-label="Formulaire de connexion"
            className="flex flex-col gap-4"
          >

            {/* Google OAuth */}
            <div className="ct-field-2">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                aria-label="Continuer avec Google"
                className="flex items-center justify-center gap-2.5 w-full transition-all duration-200 focus-visible:outline-none cursor-pointer"
                style={{
                  background:    "rgba(255,255,255,0.03)",
                  border:        "1px solid rgba(212,175,55,0.28)",
                  borderRadius:  10,
                  minHeight:     48,
                  fontFamily:    "var(--font-ui, 'Jost', sans-serif)",
                  fontSize:      14,
                  fontWeight:    400,
                  color:         "rgba(255,255,255,0.65)",
                  letterSpacing: "0.03em",
                  padding:       "0 20px",
                }}
                onMouseEnter={(e) => {
                  const t = e.currentTarget;
                  t.style.background  = "rgba(212,175,55,0.07)";
                  t.style.borderColor = "rgba(212,175,55,0.58)";
                  t.style.color       = "rgba(255,255,255,0.85)";
                }}
                onMouseLeave={(e) => {
                  const t = e.currentTarget;
                  t.style.background  = "rgba(255,255,255,0.03)";
                  t.style.borderColor = "rgba(212,175,55,0.28)";
                  t.style.color       = "rgba(255,255,255,0.65)";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline       = "2px solid rgba(212,175,55,0.4)";
                  e.currentTarget.style.outlineOffset = "2px";
                }}
                onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
              >
                {isGoogleLoading
                  ? <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  : <GoogleIcon />}
                Continuer avec Google
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 ct-field-3">
              <div className="flex-1 h-px" style={{ background: "rgba(212,175,55,0.16)" }} />
              <span
                style={{
                  fontFamily:    "var(--font-ui, 'Jost', sans-serif)",
                  fontSize:      11,
                  color:         "rgba(212,175,55,0.38)",
                  letterSpacing: "0.14em",
                  userSelect:    "none",
                }}
              >
                ou
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(212,175,55,0.16)" }} />
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
                      background: "none", border: "none", cursor: "pointer",
                      color: "rgba(212,175,55,0.45)", padding: "4px",
                      display: "flex", alignItems: "center",
                      minWidth: 44, minHeight: 44, justifyContent: "center",
                      transition: "color 160ms ease",
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
                  fontFamily:    "var(--font-ui, 'Jost', sans-serif)",
                  fontSize:      12,
                  color:         "rgba(212,175,55,0.50)",
                  letterSpacing: "0.04em",
                  textDecoration: "none",
                  transition:    "color 160ms ease",
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
        </AuthFormCard>

      </div>
    </div>
  );
};

export default SignInPage;
