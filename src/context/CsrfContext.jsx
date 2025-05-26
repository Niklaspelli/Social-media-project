/* import React, { createContext, useContext, useState, useEffect } from "react";

const CsrfContext = createContext();

export const CsrfProvider = ({ children }) => {
  const [csrfToken, setCsrfToken] = useState(null);
  const [loading, setLoading] = useState(true); // 💡 Ny loading-flagga

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/csrf-token", {
          credentials: "include",
        });

        const data = await res.json();
        if (res.ok && data.csrfToken) {
          setCsrfToken(data.csrfToken);
        } else {
          console.error("CSRF-token response error:", data.error);
        }
      } catch (err) {
        console.error("Error fetching CSRF-token:", err);
      } finally {
        setLoading(false); // ✅ Klart att använda
      }
    };

    fetchToken();
  }, []);

  return (
    <CsrfContext.Provider value={{ csrfToken, setCsrfToken, loading }}>
      {children}
    </CsrfContext.Provider>
  );
};

export const useCsrf = () => useContext(CsrfContext); */
