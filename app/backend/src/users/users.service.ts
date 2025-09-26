import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { User as PrismaUser } from '@prisma/client';

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

  async create(input: { email: string; name: string; password: string }): Promise<PrismaUser> {
    return this.prisma.user.create({ data: { email: input.email, name: input.name, password: input.password, createdAt: new Date() } });
  }

  async update(id: number, input: Partial<{ email: string; name: string; password: string }>): Promise<PrismaUser> {
    return this.prisma.user.update({ where: { id }, data: input });
  }

  async delete(id: number): Promise<PrismaUser> {
    return this.prisma.user.delete({ where: { id } });
  }
}
