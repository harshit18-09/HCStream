import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAuthBootstrap } from "../providers/AuthProvider";
import LoadingScreen from "../components/common/LoadingScreen";

const ProtectedRoute = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { isBootstrapping } = useAuthBootstrap();

  if (isBootstrapping) {
    return <LoadingScreen message="Loading your HCStream experience..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
