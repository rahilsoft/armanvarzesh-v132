
export function xorEncrypt(input: string, key: string){
  let out = '';
  for (let i=0;i<input.length;i++){ out += String.fromCharCode(input.charCodeAt(i) ^ key.charCodeAt(i % key.length)); }
  return btoa(out);
}
export function xorDecrypt(b64: string, key: string){
  const input = atob(b64);
  let out = '';
  for (let i=0;i<input.length;i++){ out += String.fromCharCode(input.charCodeAt(i) ^ key.charCodeAt(i % key.length)); }
  return out;
}
