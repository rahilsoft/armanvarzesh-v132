
import crypto from 'crypto';

export function signPreview(payload: Record<string, any>, secret: string){
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return body + '.' + sig;
}

export function verifyPreview(token: string, secret: string){
  const [body, sig] = token.split('.');
  if (!body || !sig) return false;
  const expect = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expect);
  // timingSafeEqual throws RangeError when lengths differ, so a truncated
  // signature would crash the caller instead of being rejected.
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  let json: any;
  try {
    json = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
  } catch {
    return false;
  }
  if (json.exp && Date.now() > Number(json.exp)) return false;
  return json;
}
