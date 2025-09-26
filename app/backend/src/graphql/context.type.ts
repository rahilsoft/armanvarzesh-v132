import type DataLoader from 'dataloader';
export type Loaders = Record<string, DataLoader<any, any>>;
export interface GraphQLContext { headers: Record<string, any>; loaders: Loaders; }
