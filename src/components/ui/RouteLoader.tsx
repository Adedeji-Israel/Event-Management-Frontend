import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageLoader from "./PageLoader";

const RouteLoader = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 🔥 smooth transition (not too long)

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return <PageLoader visible={loading} />;
};

export default RouteLoader;