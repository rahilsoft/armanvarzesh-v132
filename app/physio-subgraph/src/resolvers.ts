import type { IResolvers } from '@graphql-tools/utils';
const API = process.env.PHYSIO_SERVICE_URL || 'http://localhost:4061';

async function jfetch(path: string, init?: RequestInit){
  const res = await fetch(`${API}${path}`, init);
  if (!res.ok) throw new Error(`physio-service ${res.status}`);
  return res.json();
}

export const resolvers: IResolvers = {
  Query: {
    myPhysioPlan: (_,_args)=> jfetch(`/physio/plan/${_args.userId}`),
    physioProgress: (_,_args)=> jfetch(`/physio/progress/${_args.userId}?from=${_args.from||''}&to=${_args.to||''}`),
  },
  Mutation: {
    assignPhysioProtocol: async (_,_args)=>{
      await jfetch(`/physio/assign`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(_args) });
      return true;
    },
    logPain: (_,_args)=> jfetch(`/physio/session/${_args.sessionId}/pain`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ score:_args.score, notes:_args.notes }) }),
    recordRom: (_,_args)=> jfetch(`/physio/rom`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(_args) }),
    completePhysioSession: async (_,_args)=>{
      await jfetch(`/physio/session/${_args.sessionId}/complete`, { method:'POST' });
      return true;
    }
  }
};
