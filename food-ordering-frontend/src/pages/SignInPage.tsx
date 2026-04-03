// SignInPage.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "react-query";
import * as authApi from "@/api/authApi";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Lock, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

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
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

/* ─── Page ────────────────────────────────────────────────── */
const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/` },
      });
      if (error) throw error;
    } catch {
      toast.error("Google sign-in failed. Please try again.");
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
        (location.state as { from?: { pathname: string } })?.from?.pathname ||
          "/"
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
    <div className="relative min-h-screen flex items-center justify-center bg-[#0F0A1F] overflow-hidden">
      {/* ── Ambient orbs ── */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-[420px] h-[420px] rounded-full opacity-20 blur-[120px] animate-orb-drift"
        style={{
          background:
            "radial-gradient(circle, rgba(109,40,217,0.7) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-[340px] h-[340px] rounded-full opacity-10 blur-[100px] animate-orb-drift"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.7) 0%, transparent 70%)",
          animationDelay: "-7s",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-4 animate-scale-in animate-fade-in">
        {/* Brand header */}
        <div className="relative z-10 flex flex-col items-center mb-8 animate-fade-in-up">
          <div className="relative mb-3">
            <div className="absolute inset-0 rounded-full bg-[#D4AF37]/15 blur-2xl animate-glow-pulse pointer-events-none" />
            <img
              src="/logo.png"
              alt="Crêpe Time Tunisia"
              className="relative w-16 h-16 object-contain animate-float drop-shadow-[0_0_18px_rgba(212,175,55,0.35)]"
            />
          </div>
          <h1 className="text-[#D4AF37] font-heading text-2xl tracking-[0.15em] font-light uppercase">
            Crêpe Time
          </h1>
        </div>

        {/* ── Card (outer gradient ring) ── */}
        <div
          className="w-full rounded-[22px] p-[2px] transition-all duration-300 hover:shadow-[0_0_30px_1px_rgba(212,175,55,0.3)]"
          style={{
            background: "linear-gradient(163deg, #D4AF37 0%, #4C1D95 100%)",
          }}
        >
          {/* card2 — starts square, rounds on hover */}
          <div className="rounded-none transition-all duration-200 hover:rounded-[20px] hover:scale-[0.98]">
            <form
              onSubmit={handleSubmit(onSubmit)}
              autoComplete="off"
              className="flex flex-col gap-[10px] px-8 pb-[0.4em] bg-[#0F0A1F] rounded-[25px] transition-all duration-[400ms]"
            >
              {/* Heading */}
              <h2 className="text-center text-white/80 text-sm font-light tracking-[0.2em] uppercase pt-6 pb-2">
                Bon retour
              </h2>

              {/* Email field */}
              <div>
                <div className="flex items-center justify-center gap-[0.5em] rounded-[25px] p-[0.6em] bg-[#0F0A1F] shadow-[inset_2px_5px_10px_rgb(5,5,5)]">
                  <Mail className="h-[1.3em] w-[1.3em] text-[#D4AF37] shrink-0" />
                  <input
                    type="email"
                    placeholder="Email address"
                    aria-label="Email address"
                    autoComplete="off"
                    className="bg-transparent border-none outline-none w-full text-[#d3d3d3] placeholder:text-gray-600 text-sm"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1 ml-3">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password field */}
              <div>
                <div className="flex items-center justify-center gap-[0.5em] rounded-[25px] p-[0.6em] bg-[#0F0A1F] shadow-[inset_2px_5px_10px_rgb(5,5,5)]">
                  <Lock className="h-[1.3em] w-[1.3em] text-[#D4AF37] shrink-0" />
                  <input
                    type="password"
                    placeholder="Password"
                    aria-label="Password"
                    autoComplete="current-password"
                    className="bg-transparent border-none outline-none w-full text-[#d3d3d3] placeholder:text-gray-600 text-sm"
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1 ml-3">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Button row — Login + Sign Up side by side */}
              <div className="flex justify-center flex-row mt-10">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="py-2 px-6 rounded-[5px] mr-2 border-none outline-none transition-all duration-[400ms] bg-[#252525] text-white hover:bg-black disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing in…
                    </span>
                  ) : (
                    "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Login\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"
                  )}
                </button>
                <Link
                  to="/register"
                  className="py-2 px-9 rounded-[5px] border-none outline-none transition-all duration-[400ms] bg-[#252525] text-white hover:bg-black text-center"
                >
                  Sign Up
                </Link>
              </div>

              {/* ── Google divider + button ── */}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[10px] text-white/30 tracking-widest uppercase">
                  or
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-[5px] bg-[#252525] hover:bg-[#1a1a1a] border border-white/10 hover:border-[#D4AF37]/30 text-white text-xs transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGoogleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <GoogleIcon />
                )}
                Continue with Google
              </button>

              {/* Forgot Password */}
              <Link
                to="#"
                className="mb-12 py-2 rounded-[5px] border-none outline-none transition-all duration-[400ms] bg-[#252525] text-white hover:bg-red-600 text-center text-sm"
              >
                Forgot Password
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
