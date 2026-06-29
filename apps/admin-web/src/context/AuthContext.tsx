
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState<string | null>(null);

  const login = (adminData: any, jwt: any) => {
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
