import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Make sure to import useAuth

const ProtectedRoute = () => {
  const { authData } = useAuth(); // Get authentication status from context

  return authData ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
