import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Cms } from '@prisma/client';

@Injectable()
export class CmsService {
  constructor(private prisma: PrismaService) {}

  create(input: { title: string; body: string; category?: string | null }): Promise<Cms> {
    return this.prisma.cms.create({ data: { title: input.title, body: input.body, category: input.category ?? null, createdAt: new Date() } });
  }

  findAll(): Promise<Cms[]> {
    return this.prisma.cms.findMany();
  }

  findOne(id: number): Promise<Cms> {
    return this.prisma.cms.findUniqueOrThrow({ where: { id } });
  }

  update(id: number, input: { title?: string; body?: string; category?: string | null }): Promise<Cms> {
    return this.prisma.cms.update({ where: { id }, data: { title: input.title, body: input.body, category: input.category ?? null } });
  }

  delete(id: number): Promise<Cms> {
    return this.prisma.cms.delete({ where: { id } });
  }
}
