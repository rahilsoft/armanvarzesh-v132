import React, {createContext, useContext, useState, useEffect} from 'react';

export type Role = 'guest'|'user'|'coach'|'nutrition'|'physio'|'admin'|'superadmin';
type Auth = { role: Role; token?: string };
const Ctx = createContext<Auth>({ role:'guest' });

export function AuthProvider({children}:{children:React.ReactNode}){
  const [state,setState] = useState<Auth>({role:'guest'});
  useEffect(()=>{
    // TODO: hydrate from cookie/JWT
  },[]);
  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

export function useAuth(){ return useContext(Ctx); }

export function withRole(roles:Role[], Comp: React.ComponentType<any>){
  return function Wrapped(props:any){
    const {role} = useAuth();
    if(!roles.includes(role)) return <div style={{padding:16}}><h3>403</h3><p>دسترسی لازم را ندارید.</p></div>;
    return <Comp {...props}/>;
  }
}
