import { Outlet } from "react-router-dom";
import AuthBackground from "@/components/auth/AuthBackground";

/**
 * AuthLayout v3.0 — Liquid Dark Premium
 *
 * Wraps /sign-in and /register with NO Header, NO Footer.
 * AuthBackground is mounted once here so it persists across
 * both auth routes (seamless transition, single RAF loop).
 */
const AuthLayout = () => (
  <div
    className="relative min-h-[100dvh] w-full overflow-hidden"
    style={{ background: "var(--depth-1)" }}
  >
    <AuthBackground />
    <div className="relative z-10 flex min-h-[100dvh]">
      <Outlet />
    </div>
  </div>
);

export default AuthLayout;
