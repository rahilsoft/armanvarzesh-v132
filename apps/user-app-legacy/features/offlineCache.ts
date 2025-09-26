
import AsyncStorage from '@react-native-async-storage/async-storage';

type Entry = { data: string; ts: number };
const LIMIT = 50;

export async function cacheSet(key: string, data: string){
  await AsyncStorage.setItem('cache:'+key, JSON.stringify({ data, ts: Date.now() } as Entry));
  const idx = JSON.parse((await AsyncStorage.getItem('cache:index'))||'[]') as string[];
  const set = new Set(idx);
  set.delete(key); set.add(key);
  const arr = Array.from(set);
  while(arr.length > LIMIT){ const rm = arr.shift()!; await AsyncStorage.removeItem('cache:'+rm); }
  await AsyncStorage.setItem('cache:index', JSON.stringify(arr));
}
export async function cacheGet(key: string){
  const raw = await AsyncStorage.getItem('cache:'+key);
  if(!raw) return null;
  const obj = JSON.parse(raw) as Entry;
  return obj.data;
}
