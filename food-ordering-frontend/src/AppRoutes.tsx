import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./layouts/layout";
import HomePage from "./pages/HomePage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import SignInPage from "./pages/SignInPage";
import RegisterPage from "./pages/RegisterPage";
import UserProfilePage from "./pages/UserProfilePage";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminRoute from "./auth/AdminRoute";
import ManageRestaurantPage from "./pages/ManageRestaurantPage";
import SearchPage from "./pages/SearchPage";
import MenuPage from "./pages/MenuPage";
import DetailPage from "./pages/DetailPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import ApiDocsPage from "./pages/ApiDocsPage";
import ApiStatusPage from "./pages/ApiStatusPage";
import AnalyticsDashboardPage from "./pages/AnalyticsDashboardPage";
import PerformancePage from "./pages/PerformancePage";

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
            <HomePage />
          </Layout>
        }
      />
      <Route
        path="/sign-in"
        element={
          <Layout showHero={false}>
            <SignInPage />
          </Layout>
        }
      />
      <Route
        path="/register"
        element={
          <Layout showHero={false}>
            <RegisterPage />
          </Layout>
        }
      />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route
        path="/menu"
        element={
          <Layout showHero={false}>
            <MenuPage />
          </Layout>
        }
      />
      <Route
        path="/search/:city"
        element={
          <Layout showHero={false}>
            <SearchPage />
          </Layout>
        }
      />
      <Route
        path="/detail/:restaurantId"
        element={
          <Layout showHero={false}>
            <DetailPage />
          </Layout>
        }
      />
      <Route
        path="/api-docs"
        element={
          <Layout showHero={false}>
            <ApiDocsPage />
          </Layout>
        }
      />
      <Route
        path="/api-status"
        element={
          <Layout showHero={false}>
            <ApiStatusPage />
          </Layout>
        }
      />
      <Route
        path="/order-status"
        element={
          <Layout showHero={false}>
            <OrderStatusPage />
          </Layout>
        }
      />
      <Route element={<ProtectedRoute />}>
        <Route
          path="/user-profile"
          element={
            <Layout>
              <UserProfilePage />
            </Layout>
          }
        />
      </Route>
      <Route element={<AdminRoute />}>
        <Route
          path="/manage-restaurant"
          element={
            <Layout>
              <ManageRestaurantPage />
            </Layout>
          }
        />
        <Route
          path="/business-insights"
          element={
            <Layout showHero={false}>
              <AnalyticsDashboardPage />
            </Layout>
          }
        />
        <Route
          path="/optimization"
          element={
            <Layout showHero={false}>
              <PerformancePage />
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
