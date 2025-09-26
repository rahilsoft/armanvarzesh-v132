import React from 'react';
export type Role = 'guest'|'user'|'coach'|'admin'|'vip';
type Ctx = { role: Role; setRole: (r:Role)=>void };
const Ctx = React.createContext<Ctx>({ role:'guest', setRole: ()=>{} });
export function AuthProvider({ children }: React.PropsWithChildren<{}>){
  const [role, setRoleState] = React.useState<Role>(()=> (typeof localStorage!=='undefined' && (localStorage.getItem('av_role') as Role)) || 'guest');
  const setRole = (r:Role)=>{ try{ localStorage.setItem('av_role', r); }catch{} setRoleState(r); };
  return <Ctx.Provider value={{ role, setRole }}>{children}</Ctx.Provider>;
}
export function useAuth(){ return React.useContext(Ctx); }
