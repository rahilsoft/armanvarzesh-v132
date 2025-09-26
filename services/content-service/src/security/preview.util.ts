
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
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expect))) return false;
  const json = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
  if (json.exp && Date.now() > Number(json.exp)) return false;
  return json;
}
