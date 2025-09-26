
import { Injectable } from '@nestjs/common';
import { Survey } from './entities/survey.entity';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SurveyService {
  constructor(private prisma: PrismaService) {}

  async create(input: Partial<Survey>): Promise<Survey> {
    return this.prisma.survey.create({ data: { title: input.title, question: input.question, createdAt: new Date() } });
  }
  async findAll(): Promise<Survey[]> {
    return this.prisma.survey.findMany();
  }
  async findOne(id: number): Promise<Survey> {
    return this.prisma.survey.findUnique({ where: { id } });
  }

  /**
   * Update an existing survey. Returns the updated survey or null if not found.
   */
  async update(id: number, input: Partial<Survey>): Promise<Survey> {
    return this.prisma.survey.update({ where: { id }, data: { title: input.title, question: input.question } });
  }

  /**
   * Delete a survey by ID. Returns true if removed, otherwise false.
   */
  async delete(id: number): Promise<boolean> {
    await this.prisma.survey.delete({ where: { id } });
    return true;
  }
}
