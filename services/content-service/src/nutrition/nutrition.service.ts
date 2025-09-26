
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

type TDEEInput = {
  sex: 'male'|'female';
  age: number;           // years
  weightKg: number;
  heightCm: number;
  activity: 'SEDENTARY'|'LIGHT'|'MODERATE'|'ACTIVE'|'VERY_ACTIVE';
  goal?: 'cut'|'bulk'|'recomp'|'maintain';
};

@Injectable()
export class NutritionService {
  prisma = new PrismaClient();

  mifflin(input: TDEEInput){
    const { sex, age, weightKg, heightCm, activity, goal } = input;
    const s = sex === 'male' ? 5 : -161;
    const bmr = (10*weightKg) + (6.25*heightCm) - (5*age) + s;
    const factors:any = {
      SEDENTARY: 1.2, LIGHT: 1.375, MODERATE: 1.55, ACTIVE: 1.725, VERY_ACTIVE: 1.9
    };
    let tdee = bmr * (factors[activity]||1.2);

    // goal adjustment
    let delta = 0;
    if (goal === 'cut') delta = -0.15;
    else if (goal === 'bulk') delta = +0.15;
    else if (goal === 'recomp') delta = 0;
    else delta = 0;

    const target = Math.round(tdee * (1 + delta));

    // macros suggestion: P1.8g/kg, F 25% cal, C rest
    const protein = Math.round(1.8 * weightKg); // g
    const fatCal = Math.round(target * 0.25);
    const fat = Math.round(fatCal / 9); // g
    const proteinCal = protein * 4;
    const carbs = Math.max(0, Math.round((target - fatCal - proteinCal)/4)); // g

    return { bmr: Math.round(bmr), tdee: Math.round(tdee), targetCalories: target, macros:{ protein, carbs, fat } };
  }

  gramsFromUnit(unitsJson:any, unit:string, amount:number){
    if (!unitsJson) return null;
    const map = typeof unitsJson === 'string' ? JSON.parse(unitsJson) : unitsJson;
    const g = map[unit];
    if (!g) return null;
    return g * amount;
  }

  calcFoodMacros(food:any, grams:number){
    const ratio = grams/100;
    return {
      calories: +(food.calories * ratio).toFixed(1),
      protein:  +(food.protein * ratio).toFixed(1),
      carbs:    +(food.carbs   * ratio).toFixed(1),
      fat:      +(food.fat     * ratio).toFixed(1),
      grams
    };
  }

  async dayTotals(day:any){
    const sum = { calories:0, protein:0, carbs:0, fat:0 };
    for (const meal of day.meals||[]){
      for (const it of meal.items||[]){
        sum.calories += it.macros?.calories||0;
        sum.protein  += it.macros?.protein||0;
        sum.carbs    += it.macros?.carbs||0;
        sum.fat      += it.macros?.fat||0;
      }
    }
    return Object.fromEntries(Object.entries(sum).map(([k,v])=> [k, Math.round((v as number)*10)/10]));
  }

  // Generate monthly plan from template JSON
  async generatePlanFromTemplate(userId:string, createdBy:string, template:any, startDate:Date, weeks=4){
    // template format: { days:[ { meals:[ { name:'breakfast', items:[{ foodId, grams|{unit,amount} }]} ] } ] }
    const foods = await this.prisma.food.findMany();
    const foodById:any = Object.fromEntries(foods.map(f=> [f.id, f]));

    const days:any[] = [];
    const cloneDay = (d:any)=> JSON.parse(JSON.stringify(d));

    // build 7 days from template days length (or 7 if not given)
    const baseDays = (template?.days && template.days.length>0)? template.days : [ { meals:[{name:'breakfast',items:[]},{name:'lunch',items:[]},{name:'dinner',items:[]}] } ];

    for (let w=0; w<weeks; w++){
      for (let i=0; i<baseDays.length; i++){
        const d = cloneDay(baseDays[i]);
        // compute macros
        for (const meal of d.meals||[]){
          for (const it of meal.items||[]){
            const f = foodById[it.foodId];
            if (!f) continue;
            let grams = it.grams||0;
            if (!grams && it.unit && it.amount){
              const g = this.gramsFromUnit(f.unitsJson, it.unit, it.amount);
              if (g) grams = g;
            }
            it.grams = grams;
            it.macros = this.calcFoodMacros(f, grams);
            it.food = { id:f.id, nameFa:f.nameFa, nameEn:f.nameEn };
          }
        }
        d.totals = await this.dayTotals(d);
        days.push(d);
      }
    }

    const full = { startDate, weeks, days };
    const totals = {
      calories: Math.round(days.reduce((a,d)=> a + (d.totals?.calories||0), 0)),
      protein:  Math.round(days.reduce((a,d)=> a + (d.totals?.protein||0), 0)),
      carbs:    Math.round(days.reduce((a,d)=> a + (d.totals?.carbs||0), 0)),
      fat:      Math.round(days.reduce((a,d)=> a + (d.totals?.fat||0), 0)),
    };

    const plan = await this.prisma.nutritionPlan.create({
      data:{ userId, createdBy, startDate, weeks, json: full as any, totalsJson: totals as any }
    });

    return plan;
  }
}
