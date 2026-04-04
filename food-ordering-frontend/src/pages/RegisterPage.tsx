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
        {/* Brand header — matches SignIn */}
        <div className="relative z-10 flex flex-col items-center mb-8 animate-fade-in-up">
          <div className="relative mb-3 group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#D4AF37]/30 to-[#4C1D95]/20 opacity-80 blur-md animate-glow-pulse pointer-events-none" />
            <div className="relative h-16 w-16 rounded-xl overflow-hidden ring-2 ring-[#D4AF37]/50 ring-offset-2 ring-offset-[#0F0A1F] shadow-lg shadow-[#D4AF37]/15">
              <img
                src={BRAND.logo}
                alt="Crêpe Time Tunisia"
                className="h-full w-full object-contain p-1 animate-float"
              />
            </div>
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
