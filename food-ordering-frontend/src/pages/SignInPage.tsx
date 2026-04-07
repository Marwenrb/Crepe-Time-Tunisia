// SignInPage.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "react-query";
import * as authApi from "@/api/authApi";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Lock, Loader2, Eye, EyeOff, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import AuthBrandPanel from "@/components/AuthBrandPanel";

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

/* ─── Validation ──────────────────────────────────────────── */
const signInSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

/* ─── Page ────────────────────────────────────────────────── */
const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/` },
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
    resolver: zodResolver(signInSchema),
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
    <div
      className="fixed inset-0 flex items-center justify-center overflow-y-auto"
      style={{
        background:
          "linear-gradient(160deg, #1E0A3C 0%, #2E1065 28%, #4C1D95 50%, #3B0764 72%, #1E0A3C 100%)",
      }}
    >
      {/* ── Gold accent line — top ── */}
      <div className="absolute top-0 inset-x-0 z-10" aria-hidden="true">
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 10%, rgba(212,175,55,0.08) 20%, rgba(212,175,55,0.45) 50%, rgba(212,175,55,0.08) 80%, transparent 90%)",
          }}
        />
      </div>

      {/* ── Ambient orbs ── */}
      <div
        aria-hidden="true"
        className="absolute top-[-8%] left-[-6%] w-[340px] h-[340px] rounded-full opacity-25 blur-[90px]"
        style={{ background: "radial-gradient(circle, rgba(109,40,217,0.65) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[-4%] right-[-4%] w-[260px] h-[260px] rounded-full opacity-15 blur-[75px]"
        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.6) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.5) 0%, transparent 65%)" }}
      />

      {/* ── Noise texture overlay ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />

      {/* ── Floating gold particles ── */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { top: "18%", left: "12%",  delay: "0s",   size: "3px", anim: "ct-pulse 3s ease-in-out infinite" },
          { top: "72%", left: "8%",   delay: "1.2s", size: "2px", anim: "ct-float 4.5s ease-in-out infinite" },
          { top: "35%", right: "10%", delay: "0.6s", size: "4px", anim: "ct-pulse 2.8s ease-in-out infinite" },
          { top: "85%", right: "18%", delay: "1.8s", size: "2px", anim: "ct-float 5.2s ease-in-out infinite" },
          { top: "55%", left: "55%",  delay: "2.4s", size: "3px", anim: "ct-pulse 3.2s ease-in-out infinite" },
          { top: "25%", left: "40%",  delay: "0.9s", size: "2px", anim: "ct-float 4.8s ease-in-out infinite" },
          { top: "65%", right: "35%", delay: "1.6s", size: "2px", anim: "ct-pulse 3.8s ease-in-out infinite" },
          { top: "42%", left: "75%",  delay: "3s",   size: "3px", anim: "ct-float 6s ease-in-out infinite" },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              top: p.top,
              left: "left" in p ? p.left : undefined,
              right: "right" in p ? (p as {right: string}).right : undefined,
              width: p.size,
              height: p.size,
              background: "rgba(212,175,55,0.6)",
              animation: p.anim,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-4 py-6 my-auto">
        <AuthBrandPanel />

        {/* ── Card (outer gradient ring) ── */}
        <div
          className="w-full rounded-[22px] p-[2px] transition-shadow duration-300 hover:shadow-[0_0_40px_4px_rgba(212,175,55,0.35)]"
          style={{ background: "linear-gradient(163deg, #D4AF37 0%, #4C1D95 100%)" }}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
            className="flex flex-col gap-2.5 px-6 py-6 bg-[#0F0A1F] rounded-[20px]"
          >
            {/* Heading */}
            <div className="text-center pb-1">
              <h2 className="text-white/80 text-sm font-light tracking-[0.2em] uppercase">
                Bon retour
              </h2>
              <p className="text-white/25 text-[10px] mt-1 tracking-widest">
                Connectez-vous à votre compte
              </p>
            </div>

            {/* Email field */}
            <div>
              <div className="flex items-center gap-[0.5em] rounded-[25px] p-[0.6em] bg-[#0F0A1F] shadow-[inset_2px_5px_10px_rgb(5,5,5)] focus-within:shadow-[inset_2px_5px_10px_rgb(5,5,5),0_0_0_1px_rgba(212,175,55,0.3)] transition-shadow duration-200">
                <Mail className="h-[1.3em] w-[1.3em] text-[#D4AF37] shrink-0" />
                <input
                  type="email"
                  placeholder="Adresse email"
                  aria-label="Adresse email"
                  autoComplete="off"
                  className="bg-transparent border-none outline-none w-full text-[#d3d3d3] placeholder:text-gray-600 text-sm"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 ml-3">{errors.email.message}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center gap-[0.5em] rounded-[25px] p-[0.6em] bg-[#0F0A1F] shadow-[inset_2px_5px_10px_rgb(5,5,5)] focus-within:shadow-[inset_2px_5px_10px_rgb(5,5,5),0_0_0_1px_rgba(212,175,55,0.3)] transition-shadow duration-200">
                <Lock className="h-[1.3em] w-[1.3em] text-[#D4AF37] shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  aria-label="Mot de passe"
                  autoComplete="current-password"
                  className="bg-transparent border-none outline-none w-full text-[#d3d3d3] placeholder:text-gray-600 text-sm"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="shrink-0 text-gray-600 hover:text-[#D4AF37] transition-colors"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 ml-3">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot password */}
            <div className="text-right -mt-1">
              <Link
                to="/sign-in"
                className="text-[10px] text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors tracking-wider"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Button row — stacked on small screens, side-by-side otherwise */}
            <div className="flex flex-col sm:flex-row justify-center items-stretch gap-2 mt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="ct-btn-shimmer py-2.5 px-6 rounded-lg border-none outline-none transition-all duration-300 text-sm font-bold tracking-wide disabled:opacity-70 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.97]"
                style={{
                  background: "linear-gradient(135deg, #D4AF37 0%, #E5C76B 50%, #D4AF37 100%)",
                  color: "#0F0A1F",
                  boxShadow: "0 4px 16px rgba(212,175,55,0.35), 0 0 0 1px rgba(212,175,55,0.2)",
                }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connexion…
                  </span>
                ) : (
                  "Connexion"
                )}
              </button>
              <Link
                to="/register"
                className="py-2.5 px-6 rounded-lg border outline-none transition-all duration-300 text-sm font-semibold tracking-wide text-center hover:bg-[rgba(212,175,55,0.15)] hover:border-[rgba(212,175,55,0.5)]"
                style={{
                  background: "rgba(212,175,55,0.08)",
                  borderColor: "rgba(212,175,55,0.3)",
                  color: "#D4AF37",
                }}
              >
                S'inscrire
              </Link>
            </div>

            {/* ── Google divider + button ── */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] text-white/30 tracking-widest uppercase">ou</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-[5px] bg-[#252525] hover:bg-[#1a1a1a] border border-white/10 hover:border-[#D4AF37]/30 text-white text-xs transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              Continuer avec Google
            </button>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <Sparkles className="w-3 h-3 text-[#D4AF37]/40" />
              <span className="text-[9px] text-white/20 tracking-widest uppercase">
                Connexion sécurisée SSL
              </span>
              <Sparkles className="w-3 h-3 text-[#D4AF37]/40" />
            </div>
          </form>
        </div>

        {/* Bottom CTA */}
        <p className="text-white/20 text-xs text-center mt-5">
          Nouveau sur Crêpe Time ?{" "}
          <Link to="/register" className="text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors font-semibold">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
