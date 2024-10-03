/* import React, { createContext, useState } from "react";

// Create User Context
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    token: null,
    userId: null,
    username: null,
  });

  const login = (token, userId, username) => {
    setUser({ token, userId, username });
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("username", username);
  };

  const logout = () => {
    setUser({ token: null, userId: null, username: null });
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
 */
