
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState<string | null>(null);

  const login = (adminData, jwt) => {
    setAdmin(adminData);
    setToken(jwt);
  };
  const logout = () => {
    setAdmin(null);
    setToken(null);
  };

  useEffect(() => {
    // Load token from localStorage if needed
  }, []);

  return (
    <AuthContext.Provider value={{ admin, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
