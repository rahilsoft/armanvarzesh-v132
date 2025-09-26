
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);

  // Demo login/logout logic
  const login = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
  };
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    // Load token from storage if needed
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
