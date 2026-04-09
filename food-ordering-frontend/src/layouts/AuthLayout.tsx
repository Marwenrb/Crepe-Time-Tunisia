import { Outlet } from "react-router-dom";
import AuthBackground from "@/components/auth/AuthBackground";
import AuthFooter     from "@/components/auth/AuthFooter";

/**
 * AuthLayout v4.0 — Dark Luxury Artisan
 *
 * Wraps /sign-in and /register:
 *   - NO global Header (auth pages own their branding via LeftPanel / MobileHero)
 *   - AuthFooter — lightweight brand signature (no card/box, free-standing)
 *   - AuthBackground mounted once here, persists across both auth routes
 */
const AuthLayout = () => (
  <div
    className="relative w-full"
    style={{ background: "var(--depth-1, #0C0C1E)" }}
  >
    {/* Full-screen atmospheric background (fixed, behind everything) */}
    <AuthBackground />

    {/* Content column: page + signature footer */}
    <div className="relative z-10 flex flex-col min-h-[100dvh]">
      {/* Page content fills available space */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Brand signature footer — mobile only (LeftPanel owns brand on desktop) */}
      <div className="md:hidden">
        <AuthFooter />
      </div>
    </div>
  </div>
);

export default AuthLayout;
