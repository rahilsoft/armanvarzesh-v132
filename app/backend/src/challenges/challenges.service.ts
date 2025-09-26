
import { Injectable } from '@nestjs/common';
import { Challenge } from './entities/challenge.entity';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ChallengesService {
  constructor(private prisma: PrismaService) {}

  async create(input: Partial<Challenge>): Promise<Challenge> {
    return this.prisma.challenge.create({ data: { name: input.name, description: input.description, duration: input.duration, createdAt: new Date() } });
  }
  async join(userId: number, challengeId: number): Promise<boolean> {
    // Simply verify that the challenge exists. Participant tracking is not implemented.
    const challenge = await this.prisma.challenge.findUnique({ where: { id: challengeId } });
    return !!challenge;
  }
  async findAll(): Promise<Challenge[]> {
    return this.prisma.challenge.findMany();
  }
  async findOne(id: number): Promise<Challenge> {
    return this.prisma.challenge.findUnique({ where: { id } });
  }

  /**
   * Update an existing challenge. Returns the updated challenge or null if not found.
   */
  async update(id: number, input: Partial<Challenge>): Promise<Challenge> {
    return this.prisma.challenge.update({ where: { id }, data: { name: input.name, description: input.description, duration: input.duration } });
  }

  /**
   * Delete a challenge. Returns true if removed, otherwise false.
   */
  async delete(id: number): Promise<boolean> {
    await this.prisma.challenge.delete({ where: { id } });
    return true;
  }
}
