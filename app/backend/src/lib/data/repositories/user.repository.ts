import { Injectable } from '@nestjs/common';
import { SafePrismaService } from '../prisma.safe';

export type UserPublic = {
  id: string;
  username: string;
  roles: string[];
  created_at: Date;
};

/**
 * Map a persisted Prisma `User` row onto the public shape this domain layer
 * uses. The canonical schema stores a single `role` and an `email`; we adapt
 * them to the layer's `roles[]` / `username` contract.
 */
function toPublic(u: { id: number; email: string; role: string | null; createdAt: Date }): UserPublic {
  return {
    id: String(u.id),
    username: u.email,
    roles: u.role ? [u.role] : [],
    created_at: u.createdAt,
  };
}

@Injectable()
export class UserRepository {
  constructor(private readonly db: SafePrismaService) {}

  async findById(id: string): Promise<UserPublic | null> {
    const u = await this.db.user.findUnique({ where: { id: Number(id) } });
    return u ? toPublic(u) : null;
  }

  async findByUsername(username: string): Promise<UserPublic | null> {
    const u = await this.db.user.findUnique({ where: { email: username } });
    return u ? toPublic(u) : null;
  }

  async ensureAdmin(username: string, bcryptHash: string, roles: string[] = ['admin']): Promise<UserPublic> {
    const role = roles[0] ?? 'admin';
    const u = await this.db.user.upsert({
      where: { email: username },
      create: { email: username, name: username, password: bcryptHash, role },
      update: { role },
    });
    return toPublic(u);
  }
}
