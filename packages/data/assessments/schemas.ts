export type AssessTemplate = {
  id:string; title:string; steps: { id:string; title:string; fields: { id:string; label:string; type:'number'|'text'|'select'; options?:string[]; required?:boolean }[] }[]
};
export type AssessDraft = { id:string; templateId:string; values: Record<string, any>; step:number; updatedAt:number };
export type AssessSubmission = { id:string; templateId:string; values: Record<string, any>; submittedAt:string };
