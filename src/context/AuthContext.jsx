/* import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);
let cachedCsrfToken = null;

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");

  const login = (username, userId, avatar, accessToken, csrfToken) => {
    setAuthData({ username, userId, avatar, accessToken, csrfToken });
  };

  const logout = () => {
    setAuthData(null);
    setCsrfToken("");
    // här kan du lägga till en fetch till backend /logout om du har en sådan endpoint
  };

  const fetchCsrfToken = async () => {
    if (cachedCsrfToken) return cachedCsrfToken; // återanvänd token

    try {
      const response = await fetch("http://localhost:5000/api/csrf-token", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.csrfToken) {
        setCsrfToken(data.csrfToken);
      }
    } catch (err) {
      console.error("Failed to fetch CSRF token", err);
    }
  };

  useEffect(() => {
    fetchCsrfToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authData,
        isAuthenticated: !!authData,
        login,
        logout,
        csrfToken,
        setCsrfToken,
        fetchCsrfToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
 */

import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

let cachedCsrfToken = null;

// Named export så api.js kan importera den direkt
export async function getCsrfToken() {
  if (cachedCsrfToken) return cachedCsrfToken;

  const res = await fetch("http://localhost:5000/api/csrf-token", {
    credentials: "include",
  });
  const data = await res.json();
  cachedCsrfToken = data.csrfToken;
  return cachedCsrfToken;
}

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);

  const login = (username, userId, avatar, accessToken) => {
    setAuthData({ username, userId, avatar, accessToken });
    localStorage.setItem("accessToken", accessToken);
  };

  const logout = () => {
    setAuthData(null);
    cachedCsrfToken = null;
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider
      value={{ authData, isAuthenticated: !!authData, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
