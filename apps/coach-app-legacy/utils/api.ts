
export const BASE_URL = "https://api.armanfit.com";

export async function fetchJson(url: string, options?: any) {
  const res = await fetch(BASE_URL + url, options);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
