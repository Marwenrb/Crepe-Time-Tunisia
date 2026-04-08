import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import * as authApi from "@/api/authApi";
import { useQueryClient } from "react-query";
import { toast } from "sonner";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import LeftPanel  from "@/components/auth/LeftPanel";
import MobileHero from "@/components/auth/MobileHero";
import GlowCard   from "@/components/auth/GlowCard";
import AuthInput  from "@/components/ui/AuthInput";
import AuthButton from "@/components/ui/AuthButton";

/* ─── Validation ──────────────────────────────────────────── */
const registerSchema = z.object({
  name:     z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email:    z.string().email("Adresse email invalide"),
  phone:    z.string().min(8, "Entrez un numéro valide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

/* ─── Password strength ───────────────────────────────────── */
function calcStrength(pw: string): number {
  let s = 0;
  if (pw.length >= 8)           s += 25;
  if (/[A-Z]/.test(pw))        s += 25;
  if (/[0-9]/.test(pw))        s += 25;
  if (/[^a-zA-Z0-9]/.test(pw)) s += 25;
  return s;
}

const STRENGTH_LABEL: Record<number, string> = {
  25: "Très faible", 50: "Faible", 75: "Moyen", 100: "Fort",
};

const STRENGTH_COLOR: Record<number, string> = {
  25: "#F43F5E", 50: "#F97316", 75: "#F59E0B", 100: "#10B981",
};

/* ─── Page ────────────────────────────────────────────────── */
const RegisterPage = () => {
  const navigate    = useNavigate();
  const queryClient = useQueryClient();
  const [isLoading,     setIsLoading]     = useState(false);
  const [showPassword, setShowPassword]   = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver:      zodResolver(registerSchema),
    defaultValues: { name: "", email: "", phone: "", password: "" },
  });

  const pwValue    = watch("password") ?? "";
  const pwStrength = pwValue.length > 0 ? calcStrength(pwValue) : 0;
  const pwLabel    = STRENGTH_LABEL[pwStrength];
  const pwColor    = STRENGTH_COLOR[pwStrength];

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const result = await authApi.signUp(data);
      if (result.hasSession) {
        await queryClient.invalidateQueries("validateToken");
        toast.success("Compte créé ! Bienvenue chez Crêpe Time.");
        navigate("/");
        window.location.reload();
      } else {
        toast.success("Compte créé. Vérifiez votre email puis connectez-vous.");
        navigate("/sign-in");
      }
    } catch (err: unknown) {
      const ax = err as { message?: string };
      toast.error(ax.message || "Inscription échouée");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* AuthBackground is mounted in AuthLayout — not rendered here */
    <div className="w-full flex min-h-[100dvh]">

      {/* Desktop left branding panel */}
      <LeftPanel variant="register" />

      {/* Form panel — start-aligned on mobile so 4-field form scrolls naturally */}
      <div className="flex flex-col items-center justify-start md:justify-center w-full md:w-1/2 min-h-[100dvh] px-5 pt-12 pb-10">

        {/* Mobile hero (typing effect) — hidden on desktop */}
        <div className="md:hidden w-full max-w-sm mb-10">
          <MobileHero
            lines={["Ta première", "crêpe t'attend."]}
            subtitle="Rejoins la famille Crêpe Time en quelques secondes."
          />
        </div>

        {/* Glow-border form card */}
        <div className="w-full max-w-sm">
          <GlowCard>
            <form
              onSubmit={handleSubmit(onSubmit)}
              autoComplete="off"
              aria-busy={isLoading}
              className="flex flex-col gap-5"
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
                  Créer un compte
                </h1>
                <p
                  style={{
                    fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                    fontSize:   13,
                    color:      "#6B6B8A",
                    marginTop:  4,
                  }}
                >
                  Rejoignez la famille Crêpe Time
                </p>
              </div>

              {/* Name */}
              <div className="ct-field-2">
                <AuthInput
                  id="name"
                  type="text"
                  label="Nom complet"
                  icon={<User size={16} />}
                  error={errors.name?.message}
                  autoComplete="name"
                  aria-describedby={errors.name ? "name-error" : undefined}
                  {...register("name")}
                />
              </div>

              {/* Email */}
              <div className="ct-field-3">
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

              {/* Phone */}
              <div className="ct-field-4">
                <AuthInput
                  id="phone"
                  type="tel"
                  label="Téléphone / WhatsApp"
                  icon={<Phone size={16} />}
                  error={errors.phone?.message}
                  autoComplete="tel"
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  {...register("phone")}
                />
              </div>

              {/* Password + strength meter */}
              <div className="ct-field-5">
                <AuthInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  label="Mot de passe (min. 8 caractères)"
                  icon={<Lock size={16} />}
                  error={errors.password?.message}
                  autoComplete="new-password"
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

                {/* 4-segment strength bar */}
                {pwValue.length > 0 && (
                  <div className="mt-2 px-1" aria-live="polite">
                    <div className="flex gap-1">
                      {[25, 50, 75, 100].map((step) => (
                        <div
                          key={step}
                          className="flex-1 h-1 rounded-full transition-all duration-300"
                          style={{
                            background: pwStrength >= step ? pwColor : "rgba(255,255,255,0.07)",
                          }}
                        />
                      ))}
                    </div>
                    <p
                      className="text-[11px] mt-1 font-medium"
                      style={{
                        color:      pwColor,
                        fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                      }}
                    >
                      {pwLabel}
                    </p>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="ct-field-6">
                <AuthButton loading={isLoading}>
                  {isLoading ? "Création…" : "Créer mon compte"}
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
                Déjà un compte ?{" "}
                <Link to="/sign-in" style={{ color: "#8B5CF6", fontWeight: 600, textDecoration: "none" }}>
                  Se connecter
                </Link>
              </p>

              {/* Terms */}
              <p
                className="text-center"
                style={{
                  fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                  fontSize:   11,
                  color:      "#3A3A55",
                  lineHeight: 1.5,
                }}
              >
                En créant un compte, vous acceptez nos{" "}
                <span style={{ color: "rgba(139,92,246,0.5)", cursor: "pointer" }}>
                  conditions d&apos;utilisation
                </span>
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

export default RegisterPage;
