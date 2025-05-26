/* import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    username: null,
    userId: null,
    avatar: null,
    accessToken: null,
    numberOfFriends: null,
    profile: null,
  });

  const [loading, setLoading] = useState(true); // Loading state for async operations

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  // 1. Load access token from localStorage on initial mount
  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    if (savedToken) {
      setAuthData((prev) => ({ ...prev, accessToken: savedToken }));
    } else {
      setLoading(false);
    }
  }, []);

  // 2. Fetch full profile once token is available
  useEffect(() => {
    const csrfToken = getCookie("csrfToken"); // Retrieve CSRF token from cookies
    const fetchCompleteUserProfile = async () => {
      if (!authData.accessToken || !csrfToken) return; // Ensure both token and csrf are present

      try {
        const res = await fetch(`http://localhost:5000/api/auth/profile`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData.accessToken}`,
            "CSRF-TOKEN": csrfToken,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setAuthData((prev) => ({
            ...prev,
            data,
          }));
        } else {
          console.error("Failed to fetch full profile:", data.error);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false); // Once data is fetched, stop loading
      }
    };

    fetchCompleteUserProfile();
  }, [authData.accessToken]); // Runs again when accessToken changes

  // 3. Login function
  const login = (username, userId, avatar, accessToken) => {
    setAuthData({ username, userId, avatar, accessToken });
    localStorage.setItem("accessToken", accessToken);
  };

  // 4. Logout function
  const logout = () => {
    setAuthData({
      username: null,
      userId: null,
      avatar: null,
      accessToken: null,
      numberOfFriends: null,
      profile: null,
    });
    localStorage.removeItem("accessToken");
  };

  const isAuthenticated = Boolean(authData.username);
  const isLoading = loading; // Check if data is still being loaded

  return (
    <AuthContext.Provider
      value={{
        authData,
        setAuthData,
        login,
        logout,
        isAuthenticated,
        isLoading,
      }}
    >
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
 */

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

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
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/csrf-token",
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.csrfToken) {
        setCsrfToken(data.csrfToken);
      }
    } catch (err) {
      console.error("Failed to fetch CSRF token", err);
    }
  };

  useEffect(() => {
    if (!csrfToken) {
      fetchCsrfToken();
    }
  }, [csrfToken]);

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
