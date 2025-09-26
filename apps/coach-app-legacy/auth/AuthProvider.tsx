
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

type AuthState = { accessToken?: string|null; refreshToken?: string|null; role?: 'coach'|'admin'|'user'|null };
type AuthCtx = AuthState & { signIn: (token:string, refresh?:string, role?:AuthState['role'])=>Promise<void>; signOut: ()=>Promise<void> };
const Ctx = createContext<AuthCtx>({ accessToken:null, refreshToken:null, role:null, async signIn(){}, async signOut(){} });

export function AuthProvider({ children }:{ children:any }){
  const [accessToken, setAccessToken] = useState<string|null>(null);
  const [refreshToken, setRefreshToken] = useState<string|null>(null);
  const [role, setRole] = useState<AuthState['role']>(null);

  useEffect(()=>{ (async()=>{
    const t = await SecureStore.getItemAsync('refresh'); if (t) setRefreshToken(t);
    const a = await SecureStore.getItemAsync('access'); if (a) setAccessToken(a);
    const r = await SecureStore.getItemAsync('role'); if (r) setRole(r as any);
  })(); }, []);

  const signIn = async (token:string, refresh?:string, r?:AuthState['role'])=>{
    setAccessToken(token); await SecureStore.setItemAsync('access', token);
    if (refresh){ setRefreshToken(refresh); await SecureStore.setItemAsync('refresh', refresh); }
    if (r){ setRole(r); await SecureStore.setItemAsync('role', String(r)); }
  };
  const signOut = async ()=>{
    setAccessToken(null); setRefreshToken(null); setRole(null);
    await SecureStore.deleteItemAsync('access'); await SecureStore.deleteItemAsync('refresh'); await SecureStore.deleteItemAsync('role');
  };
  return <Ctx.Provider value={{ accessToken, refreshToken, role, signIn, signOut }}>{children}</Ctx.Provider>;
}
export const useAuth = ()=> useContext(Ctx);
