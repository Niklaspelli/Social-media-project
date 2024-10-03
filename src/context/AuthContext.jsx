import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    token: localStorage.getItem("token") || null,
    username: localStorage.getItem("loggedInUsername") || null,
    userId: localStorage.getItem("userId") || null,
  });

  const login = (token, username, userId) => {
    setAuthData({ token, username, userId });
    localStorage.setItem("token", token);
    localStorage.setItem("loggedInUsername", username);
    localStorage.setItem("userId", userId);
  };

  const logout = () => {
    setAuthData({ token: null, username: null, userId: null });
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUsername");
    localStorage.removeItem("userId");
  };

  const isAuthenticated = Boolean(authData.token);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "token" && !event.newValue) {
        logout();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

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
