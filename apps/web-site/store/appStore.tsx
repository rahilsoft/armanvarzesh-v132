import React, { createContext, useContext, useMemo, useState } from 'react';

/** AppProvider / useApp
 *  Minimal global state (token) to be expanded as needed.
 */
type AppState = {
  token?: string;
  setToken: (t?: string) => void;
};

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | undefined>(undefined);
  const value = useMemo(() => ({ token, setToken }), [token]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppState => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};