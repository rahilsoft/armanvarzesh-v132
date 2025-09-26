
import { Args, Field, InputType, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@ObjectType()
class IntakeQuestionDTO {
  @Field() id: string;
  @Field() key: string;
  @Field() label: string;
  @Field() type: string;
  @Field({ nullable: true }) description?: string;
  @Field({ nullable: true }) placeholder?: string;
  @Field(() => [String]) options: string[];
  @Field() required: boolean;
  @Field({ nullable: true }) section?: string;
  @Field() order: number;
  @Field({ nullable: true }) validation?: string; // JSON
  @Field({ nullable: true }) conditional?: string; // JSON
}

@ObjectType()
class IntakeFormDTO {
  @Field() id: string;
  @Field() slug: string;
  @Field() title: string;
  @Field() active: boolean;
  @Field() version: number;
  @Field({ nullable: true }) publishedAt?: Date;
  @Field(() => [IntakeQuestionDTO]) questions: IntakeQuestionDTO[];
}

@ObjectType()
class IntakeResponseDTO {
  @Field() id: string;
  @Field() userId: string;
  @Field() formId: string;
  @Field() formVersion: number;
  @Field(() => String) answers: string; // JSON stringified
  @Field() createdAt: Date;
}

@ObjectType()
class UserProfileDTO {
  @Field() userId: string;
  @Field({ nullable: true }) heightCm?: number;
  @Field({ nullable: true }) weightKg?: number;
  @Field({ nullable: true }) trainingEnv?: string;
  @Field(() => [String], { nullable: true }) equipment?: string[];
  @Field(() => [String], { nullable: true }) injuries?: string[];
  @Field({ nullable: true }) measurements?: string;
  @Field({ nullable: true }) medical?: string;
  @Field() updatedAt: Date;
  @Field() createdAt: Date;
}

@InputType()
class UpsertFormInput {
  @Field({ nullable: true }) id?: string;
  @Field() slug: string;
  @Field() title: string;
  @Field({ nullable: true }) active?: boolean;
}

@InputType()
class UpsertQuestionInput {
  @Field({ nullable: true }) id?: string;
  @Field({ nullable: true }) formId?: string;
  @Field({ nullable: true }) key?: string;
  @Field({ nullable: true }) label?: string;
  @Field({ nullable: true }) type?: string;
  @Field(() => [String], { nullable: true }) options?: string[];
  @Field({ nullable: true }) required?: boolean;
  @Field({ nullable: true }) order?: number;
  @Field({ nullable: true }) description?: string;
  @Field({ nullable: true }) placeholder?: string;
  @Field({ nullable: true }) section?: string;
  @Field({ nullable: true }) validation?: any;
  @Field({ nullable: true }) conditional?: any;
}

@Resolver()
export class IntakeResolver {
  @Query(() => [IntakeFormDTO])
  async intakeForms(): Promise<IntakeFormDTO[]> {
    const rows = await prisma.intakeForm.findMany({ include: { questions: { orderBy: { order: 'asc' } } }, orderBy: { updatedAt: 'desc' } });
    return rows as any;
  }

  @Query(() => IntakeFormDTO, { nullable: true })
  async activeIntakeForm(): Promise<IntakeFormDTO | null> {
    const row = await prisma.intakeForm.findFirst({ where: { active: true }, include: { questions: { orderBy: { order: 'asc' } } } });
    return row as any;
  }

  @Query(() => IntakeFormDTO, { nullable: true })
  async intakeForm(@Args('id', { nullable: true }) id?: string, @Args('slug', { nullable: true }) slug?: string): Promise<IntakeFormDTO | null> {
    const row = await prisma.intakeForm.findFirst({ where: { OR: [{ id }, { slug }] }, include: { questions: { orderBy: { order: 'asc' } } } });
    return row as any;
  }

  @Mutation(() => IntakeFormDTO)
  async upsertIntakeForm(@Args('input') input: UpsertFormInput): Promise<IntakeFormDTO> {
    const { id, ...data } = input;
    if (data.active) {
      await prisma.intakeForm.updateMany({ data: { active: false }, where: { active: true } });
    }
    const row = await prisma.intakeForm.upsert({
      where: { id: id || '00000000-0000-0000-0000-000000000000' },
      update: data,
      create: data as any
    });
    return row as any;
  }

  @Mutation(() => IntakeQuestionDTO)
  async upsertIntakeQuestion(@Args('input') input: UpsertQuestionInput): Promise<IntakeQuestionDTO> {
    const { id, ...data } = input as any;
    const row = await prisma.intakeQuestion.upsert({
      where: { id: id || '00000000-0000-0000-0000-000000000000' },
      update: data,
      create: data
    });
    return row as any;
  }

  @Mutation(() => Boolean)
  async deleteIntakeQuestion(@Args('id') id: string): Promise<boolean> {
    await prisma.intakeQuestion.delete({ where: { id } });
    return true;
  }

  @Mutation(() => IntakeFormDTO)
  async publishIntakeForm(@Args('id') id: string): Promise<IntakeFormDTO> {
    await prisma.intakeForm.updateMany({ where: { active: true }, data: { active: false } });
    const row = await prisma.intakeForm.update({ where: { id }, data: { active: true, version: { increment: 1 }, publishedAt: new Date() }, include: { questions: { orderBy: { order: 'asc' } } } });
    return row as any;
  }

  @Mutation(() => IntakeResponseDTO)
  async submitIntake(@Args('userId') userId: string, @Args('formId') formId: string, @Args('answers', { type: () => String }) answers: string): Promise<IntakeResponseDTO> {
    const ans = JSON.parse(answers);
    // validation
    const form = await prisma.intakeForm.findUnique({ where: { id: formId }, include: { questions: { orderBy: { order: 'asc' } } } });
    if (!form) throw new Error('Form not found');
    for (const q of form.questions){
      const val = (ans as any)[q.key];
      const cond = (q as any).conditional as any;
      const visible = !cond || !cond.showIf || cond.showIf.every((c:any)=> {
        const v = (ans as any)[c.key];
        switch(c.op){ case 'eq': return v===c.value; case 'neq': return v!==c.value; case 'gt': return v>c.value; case 'lt': return v<c.value; default: return true; }
      });
      if (!visible) continue;
      if (q.required && (val===undefined || val===null || val==='')) throw new Error(`Field ${q.key} is required`);
      if (q.validation){
        const rules = q.validation as any;
        if (rules.min !== undefined && typeof val === 'number' && val < rules.min) throw new Error(`Field ${q.key} min ${rules.min}`);
        if (rules.max !== undefined && typeof val === 'number' && val > rules.max) throw new Error(`Field ${q.key} max ${rules.max}`);
        if (rules.pattern && typeof val === 'string' && !(new RegExp(rules.pattern)).test(val)) throw new Error(`Field ${q.key} pattern mismatch`);
      }
    }
    const res = await prisma.intakeResponse.create({ data: { userId, formId, formVersion: form.version, answers: ans as any } });
    // derive profile basics
    const upd: any = {};
    if (typeof ans.heightCm === 'number') upd.heightCm = ans.heightCm;
    if (typeof ans.weightKg === 'number') upd.weightKg = ans.weightKg;
    if (ans.trainingEnv) upd.trainingEnv = ans.trainingEnv;
    if (Array.isArray(ans.equipment)) upd.equipment = ans.equipment;
    if (Array.isArray(ans.injuries)) upd.injuries = ans.injuries;
    if (ans.measurements) upd.measurements = ans.measurements;
    if (ans.medical) upd.medical = ans.medical;
    if (Object.keys(upd).length) {
      await prisma.userProfile.upsert({
        where: { userId },
        update: upd,
        create: { userId, ...upd }
      });
    }
    return { ...res, answers: JSON.stringify(res.answers) } as any;
  }

  @Query(() => UserProfileDTO, { nullable: true })
  async userProfile(@Args('userId') userId: string): Promise<UserProfileDTO | null> {
    const row = await prisma.userProfile.findUnique({ where: { userId } });
    if (!row) return null as any;
    return { ...row, measurements: row.measurements ? JSON.stringify(row.measurements) : null, medical: row.medical ? JSON.stringify(row.medical) : null } as any;
  }
}
