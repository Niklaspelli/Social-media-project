import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const NavigateToProfile = () => {
  const { authData } = useAuth();

  if (authData) {
    return <Navigate to={`/user/${authData.userId}`} replace />;
  }
  return <Navigate to="/auth" replace />;
};

export default NavigateToProfile;
