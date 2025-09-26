export type PhysioProtocol = { id:string; title:string; focus:'shoulder'|'knee'|'back'|'ankle'|'hip'; steps:string[] };
export type PhysioPlan = { id:string; protocolId:string; adherence:number; notes?:string; assignedBy?:string; createdAt:string };
