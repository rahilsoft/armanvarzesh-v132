
import React, { createContext, useState } from "react";

export const UserContext = createContext<any>(null);

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  return (
    <UserContext.Provider value={{ profile, setProfile }}>
      {children}
    </UserContext.Provider>
  );
};
