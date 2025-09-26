
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

type TemplateKey = 'FULL_BODY_3D' | 'UPPER_LOWER_4D' | 'PPL_6D';

const templates: Record<TemplateKey, any> = {
  FULL_BODY_3D: {
    days: [
      { title:'Full Body A', sectioned:[{ section:'WARMUP', muscles:['delts','hips'] }, { section:'MAIN', muscles:['quads','chest','lats'] }, { section:'COOLDOWN', muscles:['hamstrings','calves'] }] },
      { title:'Full Body B', sectioned:[{ section:'WARMUP', muscles:['delts','hips'] }, { section:'MAIN', muscles:['glutes','back','shoulders'] }, { section:'COOLDOWN', muscles:['abs'] }] },
      { title:'Full Body C', sectioned:[{ section:'WARMUP', muscles:['delts'] }, { section:'MAIN', muscles:['quads','hamstrings','chest'] }, { section:'COOLDOWN', muscles:['abs'] }] },
    ]
  },
  UPPER_LOWER_4D: {
    days: [
      { title:'Upper A', sectioned:[{ section:'WARMUP', muscles:['delts'] }, { section:'MAIN', muscles:['chest','lats','biceps','triceps'] }, { section:'COOLDOWN', muscles:['abs'] }] },
      { title:'Lower A', sectioned:[{ section:'WARMUP', muscles:['hips'] }, { section:'MAIN', muscles:['quads','glutes','hamstrings','calves'] }, { section:'COOLDOWN', muscles:[] }] },
      { title:'Upper B', sectioned:[{ section:'WARMUP', muscles:['delts'] }, { section:'MAIN', muscles:['chest','lats','shoulders'] }, { section:'COOLDOWN', muscles:['abs'] }] },
      { title:'Lower B', sectioned:[{ section:'WARMUP', muscles:['hips'] }, { section:'MAIN', muscles:['quads','glutes','hamstrings','calves'] }, { section:'COOLDOWN', muscles:[] }] },
    ]
  },
  PPL_6D: {
    days: [
      { title:'Push A', sectioned:[{ section:'WARMUP', muscles:['delts'] }, { section:'MAIN', muscles:['chest','triceps','shoulders'] }, { section:'COOLDOWN', muscles:['abs'] }] },
      { title:'Pull A', sectioned:[{ section:'WARMUP', muscles:['delts'] }, { section:'MAIN', muscles:['lats','biceps','back'] }, { section:'COOLDOWN', muscles:[] }] },
      { title:'Legs A', sectioned:[{ section:'WARMUP', muscles:['hips'] }, { section:'MAIN', muscles:['quads','glutes','hamstrings','calves'] }, { section:'COOLDOWN', muscles:[] }] },
      { title:'Push B', sectioned:[{ section:'WARMUP', muscles:['delts'] }, { section:'MAIN', muscles:['chest','triceps','shoulders'] }, { section:'COOLDOWN', muscles:['abs'] }] },
      { title:'Pull B', sectioned:[{ section:'WARMUP', muscles:['delts'] }, { section:'MAIN', muscles:['lats','biceps','back'] }, { section:'COOLDOWN', muscles:[] }] },
      { title:'Legs B', sectioned:[{ section:'WARMUP', muscles:['hips'] }, { section:'MAIN', muscles:['quads','glutes','hamstrings','calves'] }, { section:'COOLDOWN', muscles:[] }] },
    ]
  }
};

async function pickExerciseForMuscle(code:string){
  const ex = await prisma.exerciseVideo.findFirst({ where: { status:'APPROVED', primaryMuscles: { some: { code } } }, orderBy: { updatedAt: 'desc' } });
  return ex?.id || null;
}

export async function buildPlanFromTemplate(key: TemplateKey, ownerId: string, title?: string, description?: string){
  const tpl = templates[key]; if (!tpl) throw new Error('template not found');
  const plan = await prisma.plan.create({ data: { title: title || key, description: description||null, ownerId } });
  let dayOrder = 0;
  for (const d of tpl.days){
    const day = await prisma.planDay.create({ data: { planId: plan.id, order: dayOrder++, title: d.title } });
    let blockOrder = 0;
    for (const seg of d.sectioned){
      const block = await prisma.planBlock.create({ data: { dayId: day.id, order: blockOrder++, type: 'SINGLE' as any, section: seg.section, protocol: 'GVT', protocolParams: { sets: 4, reps: 10, rest: 60 } as any } });
      let itemOrder = 0;
      for (const m of seg.muscles){
        const exId = await pickExerciseForMuscle(m);
        if (!exId) continue;
        const item = await prisma.planBlockItem.create({ data: { blockId: block.id, order: itemOrder++, exerciseId: exId, note: m } });
        for (let i=0;i<4;i++){
          await prisma.planSet.create({ data: { itemId: item.id, order: i, reps: 10, rest: 60 } });
        }
      }
    }
  }
  return await prisma.plan.findUnique({ where:{ id: plan.id }, include: { days: { include: { blocks: { include: { items: { include: { sets: true } } } } } } } });
}
