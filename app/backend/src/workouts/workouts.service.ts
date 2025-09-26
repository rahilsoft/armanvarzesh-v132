import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class WorkoutsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { title: string; data?: Prisma.JsonValue; userId?: number }) {
    return this.prisma.workout.create({ data: { title: data.title, data: data.data ?? undefined, userId: data.userId ?? undefined } });
  }

  async update(id: number, data: Partial<{ title: string; data: Prisma.JsonValue; userId: number }>) {
    const patch: any = {};
    if (typeof data.title !== 'undefined') patch.title = data.title;
    if (typeof data.data  !== 'undefined') patch.data = data.data as Prisma.JsonValue;
    if (typeof data.userId !== 'undefined') patch.userId = data.userId;
    return this.prisma.workout.update({ where: { id }, data: patch });
  }

  async remove(id: number) {
    await this.prisma.workout.delete({ where: { id } });
    return { ok: true };
  }

  async findOne(id: number) {
    return this.prisma.workout.findUniqueOrThrow({ where: { id } });
  }

  async findByUser(userId: number) {
    return this.prisma.workout.findMany({ take: Number(process.env.API_DEFAULT_PAGE_SIZE) || 20,  where: { userId } });
  }

  async findAll() {
    return this.prisma.workout.findMany();
  }
}
