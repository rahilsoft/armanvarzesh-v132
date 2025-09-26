
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { PrismaClient } from '@prisma/client';
import { NutritionService } from './nutrition.service';

const prisma = new PrismaClient();
function ctxUser(ctx:any){ try{ return ctx?.req?.headers?.['x-user-id'] || null; }catch(e){ return null; } }
function must(ctx:any, role='admin'){ const r = ctx?.req?.headers?.['x-role']||'guest'; if (process.env.SKIP_AUTH==='1') return; if (r===role) return; if (role==='any' && r!=='guest') return; throw new Error('forbidden'); }

@Resolver()
export class NutritionResolver {
  constructor(private svc: NutritionService){}

  // 1) Calculators
  @Query(()=> String)
  async computeTDEE(@Args('sex') sex:'male'|'female', @Args('age') age:number, @Args('weightKg') weightKg:number, @Args('heightCm') heightCm:number, @Args('activity') activity:string, @Args('goal',{nullable:true}) goal?:string): Promise<string>{
    const res = this.svc.mifflin({ sex, age, weightKg, heightCm, activity: activity as any, goal: goal as any });
    return JSON.stringify(res);
  }

  // 2) Food DB
  @Mutation(()=> String)
  async upsertFood(@Args('id',{nullable:true}) id:string, @Args('nameFa') nameFa:string, @Args('nameEn',{nullable:true}) nameEn:string, @Args('calories') calories:number, @Args('protein') protein:number, @Args('carbs') carbs:number, @Args('fat') fat:number, @Args('unitsJson',{nullable:true}) unitsJson?:string, @Context() ctx?:any): Promise<string>{
    const userId = ctxUser(ctx)||'admin';
    const data:any = { nameFa, nameEn, calories, protein, carbs, fat, createdBy: userId };
    if (unitsJson) data.unitsJson = JSON.parse(unitsJson);
    let row;
    if (id){ row = await prisma.food.update({ where:{ id }, data }); }
    else { row = await prisma.food.create({ data }); }
    return JSON.stringify(row);
  }

  @Query(()=> String)
  async listFoods(@Args('q',{nullable:true}) q?:string, @Args('limit',{nullable:true}) limit?:number): Promise<string>{
    const where:any = q? { OR:[ { nameFa: { contains: q } }, { nameEn: { contains: q } } ] } : {};
    const rows = await prisma.food.findMany({ where, take: limit||50, orderBy:{ nameFa:'asc' } });
    return JSON.stringify(rows);
  }

  // 3) Templates
  @Mutation(()=> String)
  async upsertNutritionTemplate(@Args('id',{nullable:true}) id:string, @Args('name') name:string, @Args('goal',{nullable:true}) goal:string, @Args('json') json:string, @Context() ctx?:any): Promise<string>{
    const userId = ctxUser(ctx)||'specialist-1';
    const data:any = { name, goal, json: JSON.parse(json), createdBy: userId };
    let row;
    if (id) row = await prisma.nutritionTemplate.update({ where:{ id }, data });
    else row = await prisma.nutritionTemplate.create({ data });
    return JSON.stringify(row);
  }

  @Query(()=> String)
  async listNutritionTemplates(@Args('q',{nullable:true}) q?:string): Promise<string>{
    const rows = await prisma.nutritionTemplate.findMany({ where: q? { name: { contains: q } } : {}, orderBy:{ updatedAt:'desc' } });
    return JSON.stringify(rows);
  }

  // 4) Plan generate / read / copy
  @Mutation(()=> String)
  async generateNutritionPlan(@Args('userId') userId:string, @Args('templateId') templateId:string, @Args('startDate') startDate:string, @Args('weeks',{nullable:true}) weeks?:number, @Context() ctx?:any): Promise<string>{
    const t = await prisma.nutritionTemplate.findUnique({ where:{ id: templateId } });
    if (!t) throw new Error('template not found');
    const createdBy = ctxUser(ctx)||'specialist-1';
    const plan = await this.svc.generatePlanFromTemplate(userId, createdBy, t.json, new Date(startDate), weeks||4);
    return JSON.stringify(plan);
  }

  @Query(()=> String)
  async getNutritionPlan(@Args('userId') userId:string): Promise<string>{
    const plan = await prisma.nutritionPlan.findFirst({ where:{ userId, status:'ACTIVE' }, orderBy:{ createdAt:'desc' } });
    return JSON.stringify(plan||{});
  }

  @Mutation(()=> Boolean)
  async copyDay(@Args('planId') planId:string, @Args('fromIndex') fromIndex:number, @Args('toIndex') toIndex:number): Promise<boolean>{
    const row:any = await prisma.nutritionPlan.findUnique({ where:{ id: planId } });
    if (!row) throw new Error('plan not found');
    const json = row.json as any;
    json.days[toIndex] = JSON.parse(JSON.stringify(json.days[fromIndex]));
    await prisma.nutritionPlan.update({ where:{ id: planId }, data:{ json } });
    return true;
  }

  @Mutation(()=> Boolean)
  async copyWeek(@Args('planId') planId:string, @Args('fromWeek') fromWeek:number, @Args('toWeek') toWeek:number, @Args('weekLength',{nullable:true}) weekLength?:number): Promise<boolean>{
    const len = weekLength||7;
    const row:any = await prisma.nutritionPlan.findUnique({ where:{ id: planId } });
    if (!row) throw new Error('plan not found');
    const json = row.json as any;
    const src = json.days.slice(fromWeek*len, fromWeek*len+len).map((d:any)=> JSON.parse(JSON.stringify(d)));
    for (let i=0;i<len;i++){ json.days[toWeek*len+i] = src[i]; }
    await prisma.nutritionPlan.update({ where:{ id: planId }, data:{ json } });
    return true;
  }

  // 5) Compliance / Photo AI (placeholder)
  @Mutation(()=> Boolean)
  async markMealChecked(@Args('userId') userId:string, @Args('planId') planId:string, @Args('dayIndex') dayIndex:number, @Args('mealKey') mealKey:string, @Args('checked') checked:boolean): Promise<boolean>{
    const exist = await prisma.mealLog.findFirst({ where:{ userId, planId, dayIndex, mealKey } });
    if (exist) await prisma.mealLog.update({ where:{ id: exist.id }, data:{ checked } });
    else await prisma.mealLog.create({ data:{ userId, planId, dayIndex, mealKey, checked } });
    return true;
  }

  @Mutation(()=> String)
  async analyzeMealPhoto(@Args('userId') userId:string, @Args('planId') planId:string, @Args('dayIndex') dayIndex:number, @Args('mealKey') mealKey:string, @Args('photoUrl') photoUrl:string): Promise<string>{
    // Placeholder AI — تخمین ساده بر اساس heuristics؛ در Production مدل بینایی متصل می‌شود.
    const ai = { calories: 520, protein: 32, carbs: 58, fat: 18, confidence: 0.62 };
    const log = await prisma.mealLog.create({ data:{ userId, planId, dayIndex, mealKey, photoUrl, aiJson: ai as any } });
    return JSON.stringify(log);
  }
}
