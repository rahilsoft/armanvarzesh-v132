'use client';
import jwt_decode from 'jwt-decode';
type Props = { children: React.ReactNode, allow: string[] };
export default function RBAC({ children, allow }: Props) {
  const token = (typeof document!=='undefined') ? document.cookie.split('; ').find(r=>r.startsWith('token=process.env.TOKEN || "changeme"=')[1] : '';
  if (!token) return <div>نیاز به ورود</div>;
  try {
    const payload:any = jwt_decode(token);
    const roles = payload.roles || payload.role || [];
    const has = (Array.isArray(roles)?roles:[roles]).some((r:string)=>allow.includes(r));
    return has ? <>{children}</> : <div>دسترسی کافی ندارید</div>;
  } catch { return <div>توکن نامعتبر</div>; }
}
