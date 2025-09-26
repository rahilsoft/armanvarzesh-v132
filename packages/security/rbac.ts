export type Role = 'guest'|'user'|'coach'|'vip'|'admin';
export type Feature =
  | 'payments' | 'wallet' | 'vip' | 'live' | 'chat' | 'inbox' | 'notifications'
  | 'workouts' | 'programs' | 'schedule' | 'nutrition' | 'marketplace'
  | 'analytics' | 'admin' | 'reviews' | 'coaches' | 'cms';
export type Action = 'view'|'create'|'edit'|'delete'|'manage'|'assign'|'purchase';

export type UserCtx = { id?:string; role: Role };

const table: Record<Role, Partial<Record<Feature, Action[]>>> = {
  guest: { cms:['view'], marketplace:['view'], coaches:['view'] },
  user: {
    cms:['view'],
    workouts:['view'],
    programs:['view'],
    schedule:['view','create'],
    nutrition:['view'],
    marketplace:['view','purchase'],
    chat:['view','create'],
    inbox:['view'],
    notifications:['view'],
    wallet:['view'],
    reviews:['view','create']
  },
  coach: {
    cms:['view'],
    workouts:['view','create','edit'],
    programs:['view','create','edit','assign'],
    schedule:['view','create','edit'],
    coaches:['view'],
    chat:['view','create'],
    analytics:['view']
  },
  vip: {
    wallet:['view'],
    vip:['view'],
    live:['view'],
    marketplace:['view','purchase']
  },
  admin: {
    admin:['manage'],
    analytics:['view'],
    marketplace:['view','create','edit','delete','manage'],
    notifications:['manage'],
    cms:['manage'],
    reviews:['manage'],
    coaches:['manage']
  }
};

export function can(user: UserCtx|undefined, feature: Feature, action: Action): boolean{
  const role: Role = user?.role || 'guest';
  const allowed = table[role]?.[feature] || [];
  return allowed.includes(action) || allowed.includes('manage');
}
