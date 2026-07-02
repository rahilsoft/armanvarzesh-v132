import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { User as PrismaUser } from '@prisma/client';

/** Writable user fields, including the profile attributes folded from the
 *  former users-service. All optional except the identity fields on create. */
export interface UserWriteInput {
  email?: string;
  name?: string;
  password?: string;
  role?: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  goals?: string;
  fitnessLevel?: string;
}

/** Keep only defined, known columns — never forward arbitrary keys to Prisma. */
function pickUserFields(input: UserWriteInput): UserWriteInput {
  const out: UserWriteInput = {};
  const keys: (keyof UserWriteInput)[] = [
    'email', 'name', 'password', 'role',
    'age', 'gender', 'height', 'weight', 'goals', 'fitnessLevel',
  ];
  for (const k of keys) {
    if (input[k] !== undefined) (out as Record<string, unknown>)[k] = input[k];
  }
  return out;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<PrismaUser[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<PrismaUser> {
    return this.prisma.user.findUniqueOrThrow({ where: { id } });
  }

  async findByEmail(email: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(input: UserWriteInput & { email: string; name: string }): Promise<PrismaUser> {
    return this.prisma.user.create({
      data: { ...pickUserFields(input), email: input.email, name: input.name, createdAt: new Date() },
    });
  }

  async update(id: number, input: Partial<UserWriteInput>): Promise<PrismaUser> {
    return this.prisma.user.update({ where: { id }, data: pickUserFields(input) });
  }

  async delete(id: number): Promise<PrismaUser> {
    return this.prisma.user.delete({ where: { id } });
  }
}
