// auth/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Make sure to import useAuth

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth(); // Get authentication status from context

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
