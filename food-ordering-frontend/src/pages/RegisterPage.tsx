import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import * as authApi from "@/api/authApi";
import { useQueryClient } from "react-query";
import { toast } from "sonner";
import { User, Mail, Phone, Lock, Loader2 } from "lucide-react";
import AuthBrandPanel from "@/components/AuthBrandPanel";

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
    <div
      className="relative min-h-screen flex items-center justify-center overflow-x-hidden py-6"
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
        style={{
          background:
            "radial-gradient(circle, rgba(109,40,217,0.65) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[-4%] right-[-4%] w-[260px] h-[260px] rounded-full opacity-15 blur-[75px]"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.6) 0%, transparent 70%)",
        }}
      />
      {/* Subtle center glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.5) 0%, transparent 65%)",
        }}
      />

      {/* ── Subtle noise texture overlay ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-4 animate-scale-in animate-fade-in">
        <AuthBrandPanel />

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
              <div className="flex justify-center flex-row mt-8 gap-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="py-2.5 px-6 rounded-lg border-none outline-none transition-all duration-300 text-sm font-bold tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{
                    background:
                      "linear-gradient(135deg, #D4AF37 0%, #E5C76B 50%, #D4AF37 100%)",
                    color: "#0F0A1F",
                    boxShadow:
                      "0 4px 16px rgba(212,175,55,0.35), 0 0 0 1px rgba(212,175,55,0.2)",
                  }}
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
                  className="py-2.5 px-8 rounded-lg border outline-none transition-all duration-300 text-sm font-semibold tracking-wide text-center"
                  style={{
                    background: "rgba(212,175,55,0.08)",
                    borderColor: "rgba(212,175,55,0.3)",
                    color: "#D4AF37",
                  }}
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
