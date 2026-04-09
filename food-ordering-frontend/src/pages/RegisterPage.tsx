import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import * as authApi from "@/api/authApi";
import { useQueryClient } from "react-query";
import { toast } from "sonner";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import LeftPanel    from "@/components/auth/LeftPanel";
import MobileHero   from "@/components/auth/MobileHero";
import AuthInput    from "@/components/ui/AuthInput";
import AuthButton   from "@/components/ui/AuthButton";
import AuthFormCard from "@/components/auth/AuthFormCard";

/* ── Validation ───────────────────────────────────────────────── */
const registerSchema = z.object({
  name:     z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email:    z.string().email("Adresse email invalide"),
  phone:    z.string().min(8, "Entrez un numéro valide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

/* ── Password strength ──────────────────────────────────────── */
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

/* ── Page ─────────────────────────────────────────────────────── */
const RegisterPage = () => {
  const navigate    = useNavigate();
  const queryClient = useQueryClient();
  const [isLoading,    setIsLoading]    = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <div className="w-full flex flex-col md:flex-row md:min-h-[100dvh]">

      {/* Desktop branding panel (42%) */}
      <LeftPanel variant="register" />

      {/* Mobile atmospheric strip */}
      <MobileHero />

      {/* Form panel (58% on desktop, full on mobile) */}
      <div
        className="flex-1 flex flex-col items-center justify-start md:justify-center px-5 xs:px-6 pt-8 pb-10 md:py-12 md:min-h-[100dvh]"
        style={{
          background: "radial-gradient(ellipse 80% 45% at 50% 0%, rgba(76,29,149,0.12) 0%, transparent 65%)",
        }}
      >
        <div className="w-full" style={{ maxWidth: 400 }}>

          {/* Page heading — floats above the card */}
          <div className="ct-field-1" style={{ marginBottom: 24 }}>
            <h1
              style={{
                fontFamily:    "var(--font-luxury, 'Cormorant Garamond', Georgia, serif)",
                fontSize:      "clamp(34px, 5vw, 46px)",
                fontWeight:    300,
                letterSpacing: "0.02em",
                color:         "#E5C76B",
                lineHeight:    1.1,
                margin:        0,
              }}
            >
              Rejoignez-nous
            </h1>
            <p
              style={{
                fontFamily:    "var(--font-ui, 'Jost', sans-serif)",
                fontSize:      13,
                fontWeight:    400,
                color:         "rgba(255,255,255,0.38)",
                marginTop:     7,
                letterSpacing: "0.04em",
                lineHeight:    1.5,
              }}
            >
              Créez votre compte et savourez
            </p>
          </div>

          {/* ── UIverse spinning-border card ──────────────────── */}
          <AuthFormCard>
            <form
              onSubmit={handleSubmit(onSubmit)}
              autoComplete="off"
              aria-busy={isLoading}
              aria-label="Formulaire d'inscription"
              className="flex flex-col gap-4"
            >

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

                {/* 4-segment strength bar */}
                {pwValue.length > 0 && (
                  <div className="mt-2 px-0.5" aria-live="polite">
                    <div className="flex gap-1">
                      {[25, 50, 75, 100].map((step) => (
                        <div
                          key={step}
                          className="flex-1 h-0.5 rounded-full transition-all duration-300"
                          style={{
                            background: pwStrength >= step ? pwColor : "rgba(255,255,255,0.07)",
                          }}
                        />
                      ))}
                    </div>
                    <p
                      className="text-[11px] mt-1.5 font-medium"
                      style={{
                        color:         pwColor,
                        fontFamily:    "var(--font-ui, 'Jost', sans-serif)",
                        letterSpacing: "0.04em",
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

              {/* Switch to sign-in */}
              <p
                className="text-center"
                style={{
                  fontFamily:    "var(--font-ui, 'Jost', sans-serif)",
                  fontSize:      13,
                  color:         "rgba(255,255,255,0.38)",
                  letterSpacing: "0.02em",
                }}
              >
                Déjà un compte ?{" "}
                <Link
                  to="/sign-in"
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
                  Se connecter
                </Link>
              </p>

              {/* Terms */}
              <p
                className="text-center"
                style={{
                  fontFamily:    "var(--font-ui, 'Jost', sans-serif)",
                  fontSize:      11,
                  color:         "rgba(255,255,255,0.22)",
                  lineHeight:    1.6,
                  letterSpacing: "0.02em",
                }}
              >
                En créant un compte, vous acceptez nos{" "}
                <span
                  style={{ color: "rgba(212,175,55,0.45)", cursor: "pointer" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLSpanElement).style.color = "rgba(212,175,55,0.75)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLSpanElement).style.color = "rgba(212,175,55,0.45)";
                  }}
                >
                  conditions d&apos;utilisation
                </span>
              </p>

            </form>
          </AuthFormCard>

        </div>
      </div>

    </div>
  );
};

export default RegisterPage;
