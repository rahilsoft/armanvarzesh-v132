
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = process.env.TOKEN || "changeme";
const COACH_KEY = 'coach_profile';

export async function saveToken(token: string){
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}
export async function loadToken(): Promise<string | null>{
  try{ return await SecureStore.getItemAsync(TOKEN_KEY) }catch{ return null }
}
export async function clearToken(){
  try{ await SecureStore.deleteItemAsync(TOKEN_KEY) }catch{}
}

export async function saveCoach(coach: any){
  try{ await SecureStore.setItemAsync(COACH_KEY, JSON.stringify(coach)) }catch{}
}
export async function loadCoach(): Promise<any|null>{
  try{ const s = await SecureStore.getItemAsync(COACH_KEY); return s ? JSON.parse(s) : null }catch{ return null }
}
export async function clearCoach(){
  try{ await SecureStore.deleteItemAsync(COACH_KEY) }catch{}
}
