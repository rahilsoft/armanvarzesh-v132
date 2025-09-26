import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Experiment } from '@prisma/client';

@Injectable()
export class ExperimentsService {
  constructor(private prisma: PrismaService) {}

  create(input: { name: string; hypothesis: string }): Promise<Experiment> {
    return this.prisma.experiment.create({ data: { name: input.name, hypothesis: input.hypothesis, createdAt: new Date() } });
  }

  findAll(): Promise<Experiment[]> {
    return this.prisma.experiment.findMany();
  }

  findOne(id: number): Promise<Experiment> {
    return this.prisma.experiment.findUniqueOrThrow({ where: { id } });
  }

  update(id: number, input: { name?: string; hypothesis?: string }): Promise<Experiment> {
    return this.prisma.experiment.update({ where: { id }, data: { name: input.name, hypothesis: input.hypothesis } });
  }

  delete(id: number): Promise<Experiment> {
    return this.prisma.experiment.delete({ where: { id } });
  }
}
