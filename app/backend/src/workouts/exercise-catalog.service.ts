import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ExerciseVideo, ExerciseStatus, MuscleRef, Sport, EquipmentCatalog, AnatomyConfig, Prisma } from '@prisma/client';

/**
 * Exercise catalog — videos with muscle/equipment/sport taxonomy and the 3D
 * anatomy config. Folded from services/content-service (dismemberment step 1
 * of the committed ownership matrix; cuid ids -> core Int PKs). Lives in the
 * Workout module because the Plan* engine (next dismemberment step)
 * references ExerciseVideo.
 */

export interface CreateExerciseVideoInput {
  title: string;
  videoUrl: string;
  audioUrl?: string;
  description?: string;
  level?: string;
  kind?: string;
  ownerId?: number;
  durationSec?: number;
  thumbnailUrl?: string;
  primaryMuscleCodes?: string[];
  secondaryMuscleCodes?: string[];
  equipmentIds?: number[];
  sportIds?: number[];
}

@Injectable()
export class ExerciseCatalogService {
  constructor(private readonly prisma: PrismaService) {}

  /*** Exercise videos ***/

  async createVideo(input: CreateExerciseVideoInput): Promise<ExerciseVideo> {
    const { primaryMuscleCodes, secondaryMuscleCodes, equipmentIds, sportIds, ...scalar } = input;
    return this.prisma.exerciseVideo.create({
      data: {
        ...scalar,
        primaryMuscles: primaryMuscleCodes?.length ? { connect: primaryMuscleCodes.map((code) => ({ code })) } : undefined,
        secondaryMuscles: secondaryMuscleCodes?.length ? { connect: secondaryMuscleCodes.map((code) => ({ code })) } : undefined,
        equipment: equipmentIds?.length ? { connect: equipmentIds.map((id) => ({ id })) } : undefined,
        sports: sportIds?.length ? { connect: sportIds.map((id) => ({ id })) } : undefined,
      },
      include: { primaryMuscles: true, secondaryMuscles: true, equipment: true, sports: true },
    });
  }

  /** Moderation: only APPROVED videos are visible to plan builders/clients. */
  async setStatus(id: number, status: ExerciseStatus): Promise<ExerciseVideo> {
    const existing = await this.prisma.exerciseVideo.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('EXERCISE_NOT_FOUND');
    return this.prisma.exerciseVideo.update({ where: { id }, data: { status } });
  }

  async getVideo(id: number): Promise<ExerciseVideo | null> {
    return this.prisma.exerciseVideo.findUnique({
      where: { id },
      include: { primaryMuscles: true, secondaryMuscles: true, equipment: true, sports: true },
    });
  }

  /** Search approved videos by title/level/kind/muscle. */
  async search(params: { q?: string; level?: string; kind?: string; muscleCode?: string; includePending?: boolean; take?: number }): Promise<ExerciseVideo[]> {
    const where: Prisma.ExerciseVideoWhereInput = {
      ...(params.includePending ? {} : { status: ExerciseStatus.APPROVED }),
      ...(params.q ? { title: { contains: params.q, mode: 'insensitive' } } : {}),
      ...(params.level ? { level: params.level } : {}),
      ...(params.kind ? { kind: params.kind } : {}),
      ...(params.muscleCode ? { primaryMuscles: { some: { code: params.muscleCode } } } : {}),
    };
    return this.prisma.exerciseVideo.findMany({ where, take: params.take ?? 50, orderBy: { createdAt: 'desc' } });
  }

  async incrementView(id: number): Promise<void> {
    await this.prisma.exerciseVideo.update({ where: { id }, data: { viewCount: { increment: 1 } } });
  }

  /*** Taxonomy ***/

  upsertMuscle(code: string, name: string): Promise<MuscleRef> {
    return this.prisma.muscleRef.upsert({ where: { code }, update: { name }, create: { code, name } });
  }

  listMuscles(): Promise<MuscleRef[]> {
    return this.prisma.muscleRef.findMany({ orderBy: { code: 'asc' } });
  }

  createSport(name: string): Promise<Sport> {
    return this.prisma.sport.create({ data: { name } });
  }

  createEquipment(name: string): Promise<EquipmentCatalog> {
    return this.prisma.equipmentCatalog.create({ data: { name } });
  }

  /*** Anatomy config (3D muscle map) ***/

  /** Activate a config for a gender; deactivates the previous active one. */
  async setAnatomyConfig(gender: string, modelUrl: string, meshMap: Prisma.InputJsonValue): Promise<AnatomyConfig> {
    await this.prisma.anatomyConfig.updateMany({ where: { gender, active: true }, data: { active: false } });
    return this.prisma.anatomyConfig.create({ data: { gender, modelUrl, meshMap, active: true } });
  }

  activeAnatomyConfig(gender: string): Promise<AnatomyConfig | null> {
    return this.prisma.anatomyConfig.findFirst({ where: { gender, active: true } });
  }
}
