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
  const lastPathname = useRef(location.pathname);

  useEffect(() => {
    // Reset the guard first, in the SAME effect, so there's no
    // ordering race with a separate pathname-watching effect.
    if (lastPathname.current !== location.pathname) {
      hasShownToast.current = false;
      lastPathname.current = location.pathname;
    }

    if (loading || hasShownToast.current) return;

    const justLoggedOut = sessionStorage.getItem("justLoggedOut") === "true";
    if (justLoggedOut) {
      sessionStorage.removeItem("justLoggedOut");
      return;
    }

    if (!user) {
      toastInfo("Please login to continue");
      hasShownToast.current = true;
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      toastInfo("You are not authorized to access this page!");
      hasShownToast.current = true;
    }
  }, [user, loading, allowedRoles, location.pathname]);

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
