import { Outlet } from "react-router-dom";
import AuthBackground from "@/components/auth/AuthBackground";
import Footer from "@/components/Footer";

/**
 * AuthLayout v3.1 — Liquid Dark Premium
 *
 * Wraps /sign-in and /register:
 *   - NO global Header (auth pages own their own logo via AuthLogo / LeftPanel)
 *   - YES Footer — pinned at the bottom via flex-column layout
 *   - AuthBackground mounted once here (persists across both auth routes)
 */
const AuthLayout = () => (
  <div
    className="relative w-full"
    style={{ background: "var(--depth-1)" }}
  >
    {/* Full-screen atmospheric background (fixed, behind everything) */}
    <AuthBackground />

    {/* Content column: page content + footer */}
    <div className="relative z-10 flex flex-col min-h-[100dvh]">
      {/* Page content (sign-in or register) fills available space */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Official site footer — present on all auth pages */}
      <Footer />
    </div>
  </div>
);

export default AuthLayout;
