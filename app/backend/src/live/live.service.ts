import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Live } from '@prisma/client';

@Injectable()
export class LiveService {
  constructor(private prisma: PrismaService) {}

  create(input: { title: string; description?: string | null }): Promise<Live> {
    return this.prisma.live.create({ data: { title: input.title, description: input.description ?? null, startedAt: new Date() } });
  }

  findAll(): Promise<Live[]> {
    return this.prisma.live.findMany();
  }

  findOne(id: number): Promise<Live> {
    return this.prisma.live.findUniqueOrThrow({ where: { id } });
  }

  update(id: number, input: { title?: string; description?: string | null }): Promise<Live> {
    return this.prisma.live.update({ where: { id }, data: { title: input.title, description: input.description ?? null } });
  }

  delete(id: number): Promise<Live> {
    return this.prisma.live.delete({ where: { id } });
  }
}
