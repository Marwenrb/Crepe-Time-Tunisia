// RegisterPage.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import * as authApi from "@/api/authApi";
import { useQueryClient } from "react-query";
import { toast } from "sonner";
import { User, Mail, Phone, Lock, Loader2 } from "lucide-react";
import { BRAND } from "@/config/brand";

/* ─── Validation ──────────────────────────────────────────── */
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

/* ─── Page ────────────────────────────────────────────────── */
const RegisterPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

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
        toast.success("Account created! Signed in.");
        navigate("/");
        window.location.reload();
      } else {
        toast.success(
          "Account created. Check your email to confirm, then sign in."
        );
        navigate("/sign-in");
      }
    } catch (err: unknown) {
      const ax = err as { message?: string };
      toast.error(ax.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0F0A1F] overflow-x-hidden py-6">
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
        {/* ── Premium Brand Badge ─────────────────────────────────────────
            160×160 self-contained medallion.
            ALL rings absolutely-positioned INSIDE the box — zero overflow.
              inset-[9px]  → 142×142 outer decoration ring
              inset-[16px] → 128×128 mid decoration ring
              inset-[32px] → 96×96  logo circle
        ── */}
        <div className="flex flex-col items-center pb-6 animate-fade-in-up">
          <div className="relative w-[160px] h-[160px] mb-3">
            {/* Ambient glow — composited animation */}
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full pointer-events-none animate-glow-pulse"
              style={{ background: "radial-gradient(circle, rgba(212,175,55,0.16) 0%, transparent 68%)" }}
            />
            {/* Outer ring */}
            <div className="absolute inset-[9px] rounded-full border border-[#D4AF37]/15 pointer-events-none" />
            {/* Mid ring */}
            <div className="absolute inset-[16px] rounded-full border border-[#D4AF37]/28 pointer-events-none" />
            {/* Logo circle — 96×96 */}
            <div
              className="absolute inset-[32px] rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(155deg, #1C1040 0%, #0F0A1F 100%)",
                boxShadow:
                  "0 0 0 1.5px rgba(212,175,55,0.55), 0 8px 32px rgba(76,29,149,0.5), inset 0 1px 0 rgba(212,175,55,0.10)",
              }}
            >
              <img
                src={BRAND.logo}
                alt="Crêpe Time Tunisia"
                loading="eager"
                className="w-[58px] h-[58px] object-contain animate-float"
                style={{ filter: "drop-shadow(0 2px 14px rgba(212,175,55,0.42))" }}
              />
            </div>
          </div>
          <h1 className="text-[#D4AF37] font-heading text-2xl tracking-[0.2em] font-light uppercase">
            Crêpe Time
          </h1>
          <div className="mt-1.5 h-px w-8 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
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
                Créer un compte
              </h2>

              {/* Name field */}
              <div>
                <div className="flex items-center justify-center gap-[0.5em] rounded-[25px] p-[0.6em] bg-[#0F0A1F] shadow-[inset_2px_5px_10px_rgb(5,5,5)]">
                  <User className="h-[1.3em] w-[1.3em] text-[#D4AF37] shrink-0" />
                  <input
                    type="text"
                    placeholder="Full name"
                    aria-label="Full name"
                    autoComplete="off"
                    className="bg-transparent border-none outline-none w-full text-[#d3d3d3] placeholder:text-gray-600 text-sm"
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1 ml-3">
                    {errors.name.message}
                  </p>
                )}
              </div>

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

              {/* Phone / WhatsApp field */}
              <div>
                <div className="flex items-center justify-center gap-[0.5em] rounded-[25px] p-[0.6em] bg-[#0F0A1F] shadow-[inset_2px_5px_10px_rgb(5,5,5)]">
                  <Phone className="h-[1.3em] w-[1.3em] text-[#D4AF37] shrink-0" />
                  <input
                    type="tel"
                    placeholder="Phone / WhatsApp (+216...)"
                    aria-label="Phone or WhatsApp number"
                    autoComplete="off"
                    className="bg-transparent border-none outline-none w-full text-[#d3d3d3] placeholder:text-gray-600 text-sm"
                    {...register("phone")}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1 ml-3">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Password field */}
              <div>
                <div className="flex items-center justify-center gap-[0.5em] rounded-[25px] p-[0.6em] bg-[#0F0A1F] shadow-[inset_2px_5px_10px_rgb(5,5,5)]">
                  <Lock className="h-[1.3em] w-[1.3em] text-[#D4AF37] shrink-0" />
                  <input
                    type="password"
                    placeholder="Password (min. 8 characters)"
                    aria-label="Password"
                    autoComplete="new-password"
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

              {/* Button row — Create Account + Sign In side by side */}
              <div className="flex justify-center flex-row mt-10">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="py-2 px-5 rounded-[5px] mr-2 border-none outline-none transition-all duration-[400ms] bg-[#252525] text-white hover:bg-black disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating…
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>
                <Link
                  to="/sign-in"
                  className="py-2 px-9 rounded-[5px] border-none outline-none transition-all duration-[400ms] bg-[#252525] text-white hover:bg-black text-center"
                >
                  Sign In
                </Link>
              </div>

              {/* Already have an account */}
              <p className="mb-12 text-gray-500 text-xs text-center">
                Already have an account?{" "}
                <Link
                  to="/sign-in"
                  className="text-[#D4AF37] hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
