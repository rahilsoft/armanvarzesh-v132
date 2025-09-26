import { Prisma } from '@prisma/client';

/** Cursor format: base64(`${created_at.toISOString()}|${id}`) */
export function encodeCursor(createdAt: Date, id: string): string {
  const raw = `${createdAt.toISOString()}|${id}`;
  return Buffer.from(raw, 'utf8').toString('base64url');
}

export function decodeCursor(cursor?: string): { createdAt: Date; id: string } | null {
  if (!cursor) return null;
  try {
    const raw = Buffer.from(cursor, 'base64url').toString('utf8');
    const [iso, id] = raw.split('|');
    if (!iso || !id) return null;
    return { createdAt: new Date(iso), id };
  } catch { return null; }
}

/** Build WHERE clause for keyset pagination on (created_at DESC, id DESC) */
export function whereKeyset(descFrom?: { createdAt: Date; id: string }) {
  if (!descFrom) return Prisma.empty;
  return Prisma.sql`AND (created_at < ${descFrom.createdAt} OR (created_at = ${descFrom.createdAt} AND id < ${descFrom.id}))`;
}
