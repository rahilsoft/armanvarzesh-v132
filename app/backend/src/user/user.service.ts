import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

/** Minimal user record exposed to notification/reminder flows. */
export interface UserRecord {
  id: number;
  deviceToken?: string | null;
}

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /** Look up a user by id. Returns `null` when not found. */
  async findById(id: number | string): Promise<UserRecord | null> {
    const user = await (this.prisma as any).user.findUnique({ where: { id: Number(id) } });
    if (!user) return null;
    return { id: user.id, deviceToken: user.deviceToken ?? null };
  }
}

export const __stub = true;
