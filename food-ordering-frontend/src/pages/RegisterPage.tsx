import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import * as authApi from "@/api/authApi";
import { useQueryClient } from "react-query";
import { toast } from "sonner";
import { User, Mail, Phone, Lock, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import AuthBrandPanel from "@/components/AuthBrandPanel";

/* ─── Validation ──────────────────────────────────────────── */
const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().min(8, "Entrez un numéro valide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

/* ─── Page ────────────────────────────────────────────────── */
const RegisterPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", phone: "", password: "" },
  });

  const pwValue = watch("password") ?? "";
  const pwStrength = (() => {
    let s = 0;
    if (pwValue.length >= 8) s += 25;
    if (/[A-Z]/.test(pwValue)) s += 25;
    if (/[0-9]/.test(pwValue)) s += 25;
    if (/[^a-zA-Z0-9]/.test(pwValue)) s += 25;
    return s;
  })();
  const pwStrengthLabel =
    pwStrength <= 25 ? "Très faible" : pwStrength <= 50 ? "Faible" : pwStrength <= 75 ? "Moyen" : "Fort";
  const pwStrengthColor =
    pwStrength <= 25 ? "#ef4444" : pwStrength <= 50 ? "#f97316" : pwStrength <= 75 ? "#eab308" : "#22c55e";

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const signUpResult = await authApi.signUp(data);

      if (signUpResult.hasSession) {
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
          { top: "15%", left: "10%",  delay: "0s",   size: "3px", anim: "ct-pulse 3s ease-in-out infinite" },
          { top: "70%", left: "7%",   delay: "1.5s", size: "2px", anim: "ct-float 4.5s ease-in-out infinite" },
          { top: "30%", right: "9%",  delay: "0.8s", size: "4px", anim: "ct-pulse 2.8s ease-in-out infinite" },
          { top: "80%", right: "15%", delay: "2s",   size: "2px", anim: "ct-float 5.2s ease-in-out infinite" },
          { top: "50%", left: "52%",  delay: "2.8s", size: "3px", anim: "ct-pulse 3.5s ease-in-out infinite" },
          { top: "22%", left: "45%",  delay: "1s",   size: "2px", anim: "ct-float 4.8s ease-in-out infinite" },
          { top: "62%", right: "32%", delay: "1.7s", size: "2px", anim: "ct-pulse 3.8s ease-in-out infinite" },
          { top: "40%", left: "78%",  delay: "3.2s", size: "3px", anim: "ct-float 6s ease-in-out infinite" },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              top: p.top,
              left: "left" in p ? p.left : undefined,
              right: "right" in p ? (p as { right: string }).right : undefined,
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
                Créer un compte
              </h2>
              <p className="text-white/25 text-[10px] mt-1 tracking-widest">
                Rejoignez la famille Crêpe Time
              </p>
            </div>

            {/* Name field */}
            <div>
              <div className="flex items-center gap-[0.5em] rounded-[25px] p-[0.6em] bg-[#0F0A1F] shadow-[inset_2px_5px_10px_rgb(5,5,5)] focus-within:shadow-[inset_2px_5px_10px_rgb(5,5,5),0_0_0_1px_rgba(212,175,55,0.3)] transition-shadow duration-200">
                <User className="h-[1.3em] w-[1.3em] text-[#D4AF37] shrink-0" />
                <input
                  type="text"
                  placeholder="Nom complet"
                  aria-label="Nom complet"
                  autoComplete="off"
                  className="bg-transparent border-none outline-none w-full text-[#d3d3d3] placeholder:text-gray-600 text-sm"
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-xs mt-1 ml-3">{errors.name.message}</p>
              )}
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

            {/* Phone / WhatsApp field */}
            <div>
              <div className="flex items-center gap-[0.5em] rounded-[25px] p-[0.6em] bg-[#0F0A1F] shadow-[inset_2px_5px_10px_rgb(5,5,5)] focus-within:shadow-[inset_2px_5px_10px_rgb(5,5,5),0_0_0_1px_rgba(212,175,55,0.3)] transition-shadow duration-200">
                <Phone className="h-[1.3em] w-[1.3em] text-[#D4AF37] shrink-0" />
                <input
                  type="tel"
                  placeholder="Téléphone / WhatsApp (+216…)"
                  aria-label="Numéro de téléphone ou WhatsApp"
                  autoComplete="off"
                  className="bg-transparent border-none outline-none w-full text-[#d3d3d3] placeholder:text-gray-600 text-sm"
                  {...register("phone")}
                />
              </div>
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1 ml-3">{errors.phone.message}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center gap-[0.5em] rounded-[25px] p-[0.6em] bg-[#0F0A1F] shadow-[inset_2px_5px_10px_rgb(5,5,5)] focus-within:shadow-[inset_2px_5px_10px_rgb(5,5,5),0_0_0_1px_rgba(212,175,55,0.3)] transition-shadow duration-200">
                <Lock className="h-[1.3em] w-[1.3em] text-[#D4AF37] shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe (min. 8 caractères)"
                  aria-label="Mot de passe"
                  autoComplete="new-password"
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
              {/* Password strength indicator */}
              {pwValue.length > 0 && (
                <div className="ml-3 mt-1.5 space-y-0.5">
                  <div className="h-1 w-full rounded-full bg-white/[0.07] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${pwStrength}%`, background: pwStrengthColor }}
                    />
                  </div>
                  <p className="text-[10px] font-medium" style={{ color: pwStrengthColor }}>
                    {pwStrengthLabel}
                  </p>
                </div>
              )}
            </div>

            {/* Button row — stacked on small screens, side-by-side otherwise */}
            <div className="flex flex-col sm:flex-row justify-center items-stretch gap-2 mt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="py-2.5 px-6 rounded-lg border-none outline-none transition-all duration-300 text-sm font-bold tracking-wide disabled:opacity-70 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.97]"
                style={{
                  background: "linear-gradient(135deg, #D4AF37 0%, #E5C76B 50%, #D4AF37 100%)",
                  color: "#0F0A1F",
                  boxShadow: "0 4px 16px rgba(212,175,55,0.35), 0 0 0 1px rgba(212,175,55,0.2)",
                }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Création…
                  </span>
                ) : (
                  "Créer mon compte"
                )}
              </button>
              <Link
                to="/sign-in"
                className="py-2.5 px-6 rounded-lg border outline-none transition-all duration-300 text-sm font-semibold tracking-wide text-center hover:bg-[rgba(212,175,55,0.15)] hover:border-[rgba(212,175,55,0.5)]"
                style={{
                  background: "rgba(212,175,55,0.08)",
                  borderColor: "rgba(212,175,55,0.3)",
                  color: "#D4AF37",
                }}
              >
                Connexion
              </Link>
            </div>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <ShieldCheck className="w-3 h-3 text-[#D4AF37]/40" />
              <span className="text-[9px] text-white/20 tracking-widest uppercase">
                Données protégées — Aucune carte requise
              </span>
            </div>

            {/* Terms */}
            <p className="text-gray-600 text-[10px] text-center leading-relaxed">
              En créant un compte, vous acceptez nos{" "}
              <span className="text-[#D4AF37]/50 cursor-pointer hover:text-[#D4AF37] transition-colors">
                conditions d'utilisation
              </span>
            </p>
          </form>
        </div>

        {/* Bottom CTA */}
        <p className="text-white/20 text-xs text-center mt-5">
          Déjà un compte ?{" "}
          <Link
            to="/sign-in"
            className="text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors font-semibold"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
