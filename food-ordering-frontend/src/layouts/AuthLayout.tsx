import { Outlet } from "react-router-dom";
import AuthBackground from "@/components/auth/AuthBackground";
import Footer          from "@/components/Footer";

/**
 * AuthLayout v5.0 — Auth pages with full site Footer
 *
 * Structure:
 *  - AuthBackground: fixed, full-screen atmospheric backdrop
 *  - flex-col: page content (flex-1) + Footer (anchored bottom)
 *  - NO Header, NO AuthFooter — replaced by the real site Footer
 */
const AuthLayout = () => (
  <div
    className="relative w-full"
    style={{ background: "var(--depth-1, #0C0C1E)" }}
  >
    <AuthBackground />

    <div className="relative z-10 flex flex-col min-h-[100dvh]">
      {/* Page content expands to fill all space above the footer */}
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>

      {/* Full site footer — identical to homepage */}
      <Footer />
    </div>
  </div>
);

export default AuthLayout;
