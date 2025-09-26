export type Survey = { id:string; title:string; questions:{ id:string; text:string; type:'nps'|'text'|'single'|'multi'; options?:string[] }[] };
export type SurveySubmission = { id:string; surveyId:string; answers: Record<string, any>; at:string };
