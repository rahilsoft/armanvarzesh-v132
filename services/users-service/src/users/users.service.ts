import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { User as PrismaUser } from '@prisma/client';

/**
 * Service providing CRUD operations for users in the users microservice.
 */
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find a user by their email address. Returns undefined if not found.
   */
  async findByEmail(email: string): Promise<PrismaUser | undefined> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  /**
   * Create a new user record. Accepts a partial of the Prisma User
   * type and returns the created record.
   */
  async create(user: Partial<PrismaUser>): Promise<PrismaUser> {
    return this.prisma.user.create({ data: user as PrismaUser });
  }

  /**
   * Update an existing user. Returns the updated user or null if not found.
   */
  async update(id: number, input: Partial<PrismaUser>): Promise<PrismaUser> {
    try {
      return await this.prisma.user.update({ where: { id }, data: input });
    } catch {
      return null;
    }
  }

  /**
   * Retrieve a single user by ID. Returns undefined if not found.
   */
  async findOne(id: number): Promise<PrismaUser | undefined> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  /**
   * Retrieve all users in the system.
   */
  async findAll(): Promise<PrismaUser[]> {
    return this.prisma.user.findMany();
  }

  /**
   * Delete a user by ID. Returns true if the user existed and was removed,
   * false otherwise.
   */
  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.user.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}