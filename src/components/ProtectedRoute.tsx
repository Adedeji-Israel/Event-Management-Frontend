import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef } from "react";
import { toastInfo } from "@/utils/toast";

interface Props {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const hasShownToast = useRef(false);

  // ✅ READ GLOBAL LOGOUT FLAG
  const justLoggedOut = sessionStorage.getItem("justLoggedOut") === "true";

  useEffect(() => {
    if (loading) return;

    // ✅ HARD BLOCK: prevent login toast after logout
    if (justLoggedOut) {
      sessionStorage.removeItem("justLoggedOut"); // cleanup
      return;
    }

    // 🔐 NOT LOGGED IN
    if (!user && !hasShownToast.current) {
      toastInfo("Please login to continue");
      hasShownToast.current = true;
      return;
    }

    // 🔐 ROLE NOT ALLOWED
    if (
      user &&
      allowedRoles &&
      !allowedRoles.includes(user.role) &&
      !hasShownToast.current
    ) {
      toastInfo("You are not authorized to access this page!");
      hasShownToast.current = true;
    }
  }, [user, loading, allowedRoles, justLoggedOut]);

  // 🔄 Reset control
  useEffect(() => {
    hasShownToast.current = false;
  }, [location.pathname]);

  if (loading) return null;

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;