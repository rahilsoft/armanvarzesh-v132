
import React, { createContext, useState } from "react";

export const AdminContext = createContext<any>(null);

export const AdminProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  return (
    <AdminContext.Provider value={{ profile, setProfile }}>
      {children}
    </AdminContext.Provider>
  );
};
