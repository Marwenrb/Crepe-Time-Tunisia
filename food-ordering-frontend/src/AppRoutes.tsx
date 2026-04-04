import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Layout from "./layouts/Layout";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminRoute from "./auth/AdminRoute";

// ── Every page lazy-loaded — smaller initial bundle ─────────────────────────
const HomePage = lazy(() => import("./pages/HomePage"));
const SignInPage = lazy(() => import("./pages/SignInPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const AuthCallbackPage = lazy(() => import("./pages/AuthCallbackPage"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const ManageRestaurantPage = lazy(() => import("./pages/ManageRestaurantPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
// MenuPage removed — /menu now renders DetailPage directly (no URL change)
const DetailPage = lazy(() => import("./pages/DetailPage"));
const OrderStatusPage = lazy(() => import("./pages/OrderStatusPage"));
const ApiDocsPage = lazy(() => import("./pages/ApiDocsPage"));
const ApiStatusPage = lazy(() => import("./pages/ApiStatusPage"));
const AnalyticsDashboardPage = lazy(() => import("./pages/AnalyticsDashboardPage"));
const PerformancePage = lazy(() => import("./pages/PerformancePage"));

// ── Premium loading fallback ───────────────────────────────────────────────
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] gap-5 select-none">
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 rounded-full border-[3px] border-crepe-purple/10" />
      <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-crepe-gold animate-spin" style={{ animationDuration: "900ms" }} />
      <div className="absolute inset-[6px] rounded-full border-[2px] border-crepe-purple/10" />
      <div className="absolute inset-0 flex items-center justify-center text-2xl">🥞</div>
    </div>
    <p className="text-xs font-semibold tracking-[0.25em] uppercase text-crepe-purple/50">Crêpe Time…</p>
  </div>
);

const Lazy = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

function OAuthRedirectHandler({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/auth/callback") return;
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const hashCode = location.hash?.includes("code=");
    if (code || hashCode) {
      window.location.replace(`/auth/callback${location.search}${location.hash}`);
    }
  }, [location.pathname, location.search, location.hash]);

  return <>{children}</>;
}

const AppRoutes = () => {
  return (
    <OAuthRedirectHandler>
      <Routes>
        <Route
          path="/"
          element={
            <Layout showHero>
              <Lazy><HomePage /></Lazy>
            </Layout>
          }
        />
        <Route
          path="/sign-in"
          element={
            <Layout showHero={false}>
              <Lazy><SignInPage /></Lazy>
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout showHero={false}>
              <Lazy><RegisterPage /></Lazy>
            </Layout>
          }
        />
        <Route path="/auth/callback" element={<Lazy><AuthCallbackPage /></Lazy>} />
        <Route
          path="/menu"
          element={
            <Layout showHero={false}>
              <Lazy><DetailPage /></Lazy>
            </Layout>
          }
        />
        <Route
          path="/search/:city"
          element={
            <Layout showHero={false}>
              <Lazy><SearchPage /></Lazy>
            </Layout>
          }
        />
        <Route
          path="/detail/:restaurantId"
          element={
            <Layout showHero={false}>
              <Lazy><DetailPage /></Lazy>
            </Layout>
          }
        />
        <Route
          path="/order-status"
          element={
            <Layout showHero={false}>
              <Lazy><OrderStatusPage /></Lazy>
            </Layout>
          }
        />
        <Route element={<ProtectedRoute />}>
          <Route
            path="/user-profile"
            element={
              <Layout>
                <Lazy><UserProfilePage /></Lazy>
              </Layout>
            }
          />
        </Route>
        <Route element={<AdminRoute />}>
          <Route
            path="/manage-restaurant"
            element={
              <Layout>
                <Lazy><ManageRestaurantPage /></Lazy>
              </Layout>
            }
          />
          <Route
            path="/business-insights"
            element={
              <Layout showHero={false}>
                <Lazy><AnalyticsDashboardPage /></Lazy>
              </Layout>
            }
          />
          <Route
            path="/optimization"
            element={
              <Layout showHero={false}>
                <Lazy><PerformancePage /></Lazy>
              </Layout>
            }
          />
          <Route
            path="/api-docs"
            element={
              <Layout showHero={false}>
                <Lazy><ApiDocsPage /></Lazy>
              </Layout>
            }
          />
          <Route
            path="/api-status"
            element={
              <Layout showHero={false}>
                <Lazy><ApiStatusPage /></Lazy>
              </Layout>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </OAuthRedirectHandler>
  );
};

export default AppRoutes;
