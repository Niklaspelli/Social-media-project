import React, { createContext, useContext, useState, useEffect } from "react";

// AuthContext stores authentication data and handles login/logout
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    username: null,
    userId: null,
    avatar: null,
    accessToken: null, // New state for accessToken
  });

  // Check for saved access token on startup
  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    if (savedToken) {
      setAuthData((prevState) => ({
        ...prevState,
        accessToken: savedToken,
      }));
    }
  }, []);

  // Login function stores user data and the access token in the state and localStorage
  const login = (username, userId, avatar, accessToken) => {
    setAuthData({ username, userId, avatar, accessToken });
    localStorage.setItem("accessToken", accessToken);
  };

  // Logout function clears the state and removes access token from localStorage
  const logout = () => {
    setAuthData({
      username: null,
      userId: null,
      avatar: null,
      accessToken: null,
    });
    localStorage.removeItem("accessToken"); // Clear the token from localStorage
  };

  // isAuthenticated is true if username exists (logged in state)
  const isAuthenticated = Boolean(authData.username);

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
