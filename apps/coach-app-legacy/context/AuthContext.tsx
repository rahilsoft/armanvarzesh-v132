
import React, { createContext, useState, useEffect, useMemo } from "react";
import { saveToken, loadToken, clearToken, saveCoach, loadCoach, clearCoach } from "@utils/secure";
import { setToken as setTokenStore } from "@graphql/tokenStore";

type Coach = { id: string; email: string; name?: string; role?: string };
type AuthCtx = {
  coach: Coach | null;
  token: string | null;
  loading: boolean;
  login: (coach: Coach, token: string) => Promise<void>;
  logout: () => Promise<void>;
  restore: () => Promise<void>;
};

export const AuthContext = createContext<AuthCtx>({
  coach: null, token: null, loading: true,
  login: async ()=>{}, logout: async ()=>{}, restore: async ()=>{}
});

export const AuthProvider = ({ children }) => {
  const [coach, setCoach] = useState<Coach | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const applyToken = (t: string | null) => { setToken(t); setTokenStore(t); };

  const restore = async () => {
    setLoading(true);
    try{
      const [t, c] = await Promise.all([loadToken(), loadCoach()]);
      if (t){ applyToken(t); }
      if (c){ setCoach(c); }
    } finally { setLoading(false); }
  };

  useEffect(()=>{ restore(); }, []);

  const login = async (c: Coach, t: string) => {
    setCoach(c); applyToken(t);
    await Promise.all([ saveToken(t), saveCoach(c) ]);
  };
  const logout = async () => {
    setCoach(null); applyToken(null);
    await Promise.all([ clearToken(), clearCoach() ]);
  };

  const value = useMemo(()=>({ coach, token, loading, login, logout, restore }), [coach, token, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
