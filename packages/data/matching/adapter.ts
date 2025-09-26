import type { MatchInput, MatchResult } from './schemas';
import type { Coach } from '../coaches/schemas';
import { list as listCoaches } from '../coaches/adapter';

export async function match(input: MatchInput): Promise<MatchResult[]>{
  const coaches: Coach[] = await listCoaches({});
  const results = coaches.map(c=>{
    let score = 0;
    if(input.genderPref && input.genderPref!=='any' && c.gender===input.genderPref) score += 10;
    if(input.priceMax && c.price <= input.priceMax) score += 10;
    if(input.langs && input.langs.some(l=> (c.languages||[]).includes(l))) score += 10;
    if(input.tags && input.tags.every(t=> c.tags.includes(t))) score += 20;
    if(input.goal==='mobility' && c.tags.includes('mobility')) score += 30;
    if(input.goal==='weight-loss' && (c.tags.includes('hiit')||c.tags.includes('nutrition'))) score += 30;
    if(input.goal==='muscle' && c.tags.includes('strength')) score += 30;
    if(input.goal==='endurance' && c.tags.includes('hiit')) score += 25;
    score += Math.round(c.rating*2);
    return { coachId: c.id, score };
  }).sort((a,b)=> b.score - a.score);
  return results;
}
