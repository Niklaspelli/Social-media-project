import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    username: null,
    userId: null,
    avatar: null,
  });

  const login = (username, userId, avatar) => {
    setAuthData({ username, userId, avatar });
    // No need to store the token in localStorage anymore
  };

  const logout = () => {
    setAuthData({ username: null, userId: null, avatar: null });
    // Optionally clear any client-side state or perform additional logout actions
  };

  const isAuthenticated = Boolean(authData.username); // Adjusted to check if the username exists

  return (
    <AuthContext.Provider value={{ authData, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
