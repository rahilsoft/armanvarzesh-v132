import DataLoader from 'dataloader';
export function createByIdLoader<T>(batchFn:(ids:readonly string[])=>Promise<(T|null)[]>) { return new DataLoader<string,T|null>(async (ids)=>{ return await batchFn(ids); }, { cache:true }); }
export function buildLoaders(){ return {}; }
export type Loaders = ReturnType<typeof buildLoaders>;
