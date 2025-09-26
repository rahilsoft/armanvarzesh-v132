import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { makeLoader } from '@arman/graphql-utils/src/dataloader';

function indexBy<T extends Record<string, any>, K extends keyof T>(rows: T[], key: K): Map<any, T> {
  const m = new Map<any, T>();
  for (const r of rows) m.set(r[key], r);
  return m;
}

@Injectable()
export class LoadersFactory {
  constructor(private prisma: PrismaService) {}

  create() {
    // NOTE: The model names may differ; adjust to your Prisma schema.
    const usersById = makeLoader<string, any>(async (ids) => {
      const rows = await (this.prisma as any).user.findMany({ where: { id: { in: ids as string[] } } });
      const map = indexBy(rows, "id");
      return ids.map(id => map.get(id) ?? new Error("User not found"));
    });
    const workoutsById = makeLoader<string, any>(async (ids) => {
      const rows = await (this.prisma as any).workout.findMany({ where: { id: { in: ids as string[] } } });
      const map = indexBy(rows, "id");
      return ids.map(id => map.get(id) ?? new Error("Workout not found"));
    });
    return { usersById, workoutsById };
  }
}
