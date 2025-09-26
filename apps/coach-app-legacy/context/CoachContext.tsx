
import React, { createContext, useState } from "react";

export const CoachContext = createContext<any>(null);

export const CoachProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  return (
    <CoachContext.Provider value={{ profile, setProfile }}>
      {children}
    </CoachContext.Provider>
  );
};
