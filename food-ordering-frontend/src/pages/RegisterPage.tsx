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

/* â”€â”€â”€ Validation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractÃ¨res"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().min(8, "Entrez un numÃ©ro valide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractÃ¨res"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

/* â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const RegisterPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", phone: "", password: "" },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const signUpResult = await authApi.signUp(data);

      if (signUpResult.hasSession) {
        await queryClient.invalidateQueries("validateToken");
        toast.success("Compte crÃ©Ã© ! Bienvenue chez CrÃªpe Time.");
        navigate("/");
        window.location.reload();
      } else {
        toast.success("Compte crÃ©Ã©. VÃ©rifiez votre email puis connectez-vous.");
        navigate("/sign-in");
      }
    } catch (err: unknown) {
      const ax = err as { message?: string };
      toast.error(ax.message || "Inscription Ã©chouÃ©e");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-x-hidden py-6"
      style={{
        background:
          "linear-gradient(160deg, #1E0A3C 0%, #2E1065 28%, #4C1D95 50%, #3B0764 72%, #1E0A3C 100%)",
      }}
    >
      {/* â”€â”€ Gold accent line â€” top â”€â”€ */}
      <div className="absolute top-0 inset-x-0 z-10" aria-hidden="true">
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 10%, rgba(212,175,55,0.08) 20%, rgba(212,175,55,0.45) 50%, rgba(212,175,55,0.08) 80%, transparent 90%)",
          }}
        />
      </div>

      {/* â”€â”€ Ambient orbs â”€â”€ */}
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

      {/* â”€â”€ Noise texture overlay â”€â”€ */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />

      {/* â”€â”€ Floating gold particles â”€â”€ */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { top: "15%", left: "10%", delay: "0s", size: "3px" },
          { top: "70%", left: "7%", delay: "1.5s", size: "2px" },
          { top: "30%", right: "9%", delay: "0.8s", size: "4px" },
          { top: "80%", right: "15%", delay: "2s", size: "2px" },
          { top: "50%", left: "52%", delay: "2.8s", size: "3px" },
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
              animation: `ct-pulse 3s ease-in-out infinite`,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* â”€â”€ Content â”€â”€ */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-4 animate-scale-in animate-fade-in">
        <AuthBrandPanel />

        {/* â”€â”€ Card (outer gradient ring) â€” PRESERVED â”€â”€ */}
        <div
          className="w-full rounded-[22px] p-[2px] transition-all duration-300 hover:shadow-[0_0_30px_1px_rgba(212,175,55,0.3)]"
          style={{ background: "linear-gradient(163deg, #D4AF37 0%, #4C1D95 100%)" }}
        >
          <div className="rounded-none transition-all duration-200 hover:rounded-[20px] hover:scale-[0.98]">
            <form
              onSubmit={handleSubmit(onSubmit)}
              autoComplete="off"
              className="flex flex-col gap-[10px] px-8 pb-[0.4em] bg-[#0F0A1F] rounded-[25px] transition-all duration-[400ms]"
            >
              {/* Heading */}
              <div className="text-center pt-6 pb-1">
                <h2 className="text-white/80 text-sm font-light tracking-[0.2em] uppercase">
                  CrÃ©er un compte
                </h2>
                <p className="text-white/25 text-[10px] mt-1 tracking-widest">
                  Rejoignez la famille CrÃªpe Time
                </p>
              </div>

              {/* Name field */}
              <div>
                <div className="flex items-center justify-center gap-[0.5em] rounded-[25px] p-[0.6em] bg-[#0F0A1F] shadow-[inset_2px_5px_10px_rgb(5,5,5)] focus-within:shadow-[inset_2px_5px_10px_rgb(5,5,5),0_0_0_1px_rgba(212,175,55,0.3)] transition-shadow duration-200">
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
                <div className="flex items-center justify-center gap-[0.5em] rounded-[25px] p-[0.6em] bg-[#0F0A1F] shadow-[inset_2px_5px_10px_rgb(5,5,5)] focus-within:shadow-[inset_2px_5px_10px_rgb(5,5,5),0_0_0_1px_rgba(212,175,55,0.3)] transition-shadow duration-200">
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
                <div className="flex items-center justify-center gap-[0.5em] rounded-[25px] p-[0.6em] bg-[#0F0A1F] shadow-[inset_2px_5px_10px_rgb(5,5,5)] focus-within:shadow-[inset_2px_5px_10px_rgb(5,5,5),0_0_0_1px_rgba(212,175,55,0.3)] transition-shadow duration-200">
                  <Phone className="h-[1.3em] w-[1.3em] text-[#D4AF37] shrink-0" />
                  <input
                    type="tel"
                    placeholder="TÃ©lÃ©phone / WhatsApp (+216â€¦)"
                    aria-label="NumÃ©ro de tÃ©lÃ©phone ou WhatsApp"
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
                <div className="flex items-center justify-center gap-[0.5em] rounded-[25px] p-[0.6em] bg-[#0F0A1F] shadow-[inset_2px_5px_10px_rgb(5,5,5)] focus-within:shadow-[inset_2px_5px_10px_rgb(5,5,5),0_0_0_1px_rgba(212,175,55,0.3)] transition-shadow duration-200">
                  <Lock className="h-[1.3em] w-[1.3em] text-[#D4AF37] shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe (min. 8 caractÃ¨res)"
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
              </div>

              {/* Button row */}
              <div className="flex justify-center flex-row mt-8 gap-2">
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
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      CrÃ©ationâ€¦
                    </span>
                  ) : (
                    "CrÃ©er mon compte"
                  )}
                </button>
                <Link
                  to="/sign-in"
                  className="py-2.5 px-8 rounded-lg border outline-none transition-all duration-300 text-sm font-semibold tracking-wide text-center hover:bg-[rgba(212,175,55,0.15)] hover:border-[rgba(212,175,55,0.5)]"
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
              <div className="flex items-center justify-center gap-1.5 mt-2 mb-4">
                <ShieldCheck className="w-3 h-3 text-[#D4AF37]/40" />
                <span className="text-[9px] text-white/20 tracking-widest uppercase">
                  DonnÃ©es protÃ©gÃ©es â€” Aucune carte requise
                </span>
              </div>

              {/* Terms */}
              <p className="mb-10 text-gray-600 text-[10px] text-center leading-relaxed">
                En crÃ©ant un compte, vous acceptez nos{" "}
                <span className="text-[#D4AF37]/50 cursor-pointer hover:text-[#D4AF37] transition-colors">
                  conditions d'utilisation
                </span>
              </p>
            </form>
          </div>
        </div>

        {/* Bottom CTA */}
        <p className="text-white/20 text-xs text-center mt-5">
          DÃ©jÃ  un compte ?{" "}
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
