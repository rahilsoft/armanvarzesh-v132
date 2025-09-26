import { Injectable } from '@nestjs/common';
import { SafePrismaService } from '../prisma.safe';

export type UserPublic = {
  id: string;
  username: string;
  roles: string[];
  created_at: Date;
};

@Injectable()
export class UserRepository {
  constructor(private readonly db: SafePrismaService) {}

  async findById(id: string): Promise<UserPublic | null> {
    const u = await this.db.user.findUnique({ where: { id } });
    return u ? { id: u.id, username: u.username, roles: u.roles as any, created_at: u.created_at } : null;
  }

  async findByUsername(username: string): Promise<UserPublic | null> {
    const u = await this.db.user.findUnique({ where: { username } });
    return u ? { id: u.id, username: u.username, roles: u.roles as any, created_at: u.created_at } : null;
  }

  async ensureAdmin(username: string, bcryptHash: string, roles: string[] = ['admin']): Promise<UserPublic> {
    const u = await this.db.user.upsert({
      where: { username },
      create: { username, password_hash: bcryptHash, roles },
      update: { roles },
    });
    return { id: u.id, username: u.username, roles: u.roles as any, created_at: u.created_at };
  }
}
