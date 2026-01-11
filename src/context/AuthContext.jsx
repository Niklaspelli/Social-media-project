import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// 🔐 CSRF-token cache och skydd mot parallella requests
let cachedCsrfToken = null;
let pendingCsrfPromise = null;

export async function getCsrfToken() {
  // ✅ Returnera redan sparad token om den finns
  if (cachedCsrfToken) return cachedCsrfToken;
  // ✅ Om en request redan pågår — vänta på den
  if (pendingCsrfPromise) return pendingCsrfPromise;

  // 🔄 Annars, hämta ny token
  pendingCsrfPromise = fetch("http://localhost:5000/api/csrf-token", {
    credentials: "include",
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch CSRF token");
      return res.json();
    })
    .then((data) => {
      cachedCsrfToken = data.csrfToken;
      pendingCsrfPromise = null;
      return cachedCsrfToken;
    })
    .catch((err) => {
      pendingCsrfPromise = null;
      throw err;
    });
  console.log("GET CSRF TOKEN");

  return pendingCsrfPromise;
}

export function clearCsrfToken() {
  cachedCsrfToken = null;
}

// ✅ Exportera accessToken-hämtare på rätt nivå
export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export const AuthProvider = ({ children }) => {
  // Läs user-data från localStorage vid init
  const [authData, setAuthData] = useState(() => {
    const savedUser = localStorage.getItem("userData");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (username, userId, avatar, accessToken) => {
    const data = { username, userId, avatar, accessToken };
    setAuthData(data);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("userData", JSON.stringify(data));
  };

  const logout = () => {
    setAuthData(null);
    clearCsrfToken();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userData");
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
