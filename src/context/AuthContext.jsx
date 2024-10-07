import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    token: localStorage.getItem("token") || null,
    username: localStorage.getItem("loggedInUsername") || null,
    userId: localStorage.getItem("userId") || null,
    avatar: localStorage.getItem("avatar") || null, // Added avatarUrl
  });

  const login = (token, username, userId, avatar) => {
    setAuthData({ token, username, userId, avatar });
    localStorage.setItem("token", token);
    localStorage.setItem("loggedInUsername", username);
    localStorage.setItem("userId", userId);
    localStorage.setItem("avatar", avatar); // Store avatarUrl
  };

  const logout = () => {
    setAuthData({ token: null, username: null, userId: null, avatar: null }); // Reset avatarUrl
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
