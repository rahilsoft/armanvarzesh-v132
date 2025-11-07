/**
 * Cursor-based pagination utilities
 * Standard implementation across all services
 */

export interface CursorPaginationInput {
  limit?: number;
  cursor?: string;
}

export interface CursorPaginationResult<T> {
  nodes: T[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
  totalCount?: number;
}

export function encodeCursor(value: string | number): string {
  return Buffer.from(String(value)).toString('base64');
}

export function decodeCursor(cursor: string): string {
  return Buffer.from(cursor, 'base64').toString('utf-8');
}

export function createPageInfo<T extends { id: string }>(
  items: T[],
  limit: number,
  hasMore: boolean
): CursorPaginationResult<T>['pageInfo'] {
  return {
    hasNextPage: hasMore,
    hasPreviousPage: false, // Implement backward pagination if needed
    startCursor: items.length > 0 ? encodeCursor(items[0].id) : null,
    endCursor: items.length > 0 ? encodeCursor(items[items.length - 1].id) : null,
  };
}
