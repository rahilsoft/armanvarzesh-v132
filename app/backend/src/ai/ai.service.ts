
import { Injectable } from '@nestjs/common';
import { AiEntity } from './entities/ai.entity';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  async generateWorkoutPlan(userId: number, input: any): Promise<AiEntity> {
    // Persist the generated plan using Prisma. This simple implementation
    // stores the plan text and associates it with the user. In a real
    // scenario, `input` could be used to customize the plan.
    return this.prisma.aiEntity.create({
      data: {
        userId,
        plan: `Personalized workout plan for user #${userId}`,
        createdAt: new Date()
      }
    });
  }

  /**
   * Generate a simple nutrition plan for the user based on the provided
   * input. In this placeholder implementation the plan is a static
   * string, but in a real system you would use `input` to tailor the
   * recommendations to the user's goals and dietary preferences.
   */
  async generateNutritionPlan(userId: number, input: any): Promise<AiEntity> {
    return this.prisma.aiEntity.create({
      data: {
        userId,
        plan: `Personalized nutrition plan for user #${userId}`,
        createdAt: new Date()
      }
    });
  }
  async getLatestPlan(userId: number): Promise<AiEntity> {
    // Retrieve the latest plan by ordering by creation date descending.
    return this.prisma.aiEntity.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
