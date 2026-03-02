import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import { useEffect } from "react";

/**
 * Protects admin-only routes (manage-restaurant, business-insights, optimization).
 * Redirects non-admin users to home.
 */
const AdminRoute = () => {
  const { isLoggedIn, isAdmin } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/sign-in", { state: { from: location } });
      return;
    }
    if (!isAdmin) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, isAdmin, navigate, location]);

  if (!isLoggedIn || !isAdmin) return null;
  return <Outlet />;
};

export default AdminRoute;
