export class AppError extends Error { constructor(public code: string, message: string) { super(message); this.name = 'AppError'; } }
export const Errors = {
  NotFound: (entity: string, id?: string) => new AppError('NOT_FOUND', `${entity} not found${id ? ' ('+id+')' : ''}`),
  Conflict: (msg = 'Conflict') => new AppError('CONFLICT', msg),
  Unauthorized: (msg = 'Unauthorized') => new AppError('UNAUTHORIZED', msg),
  Forbidden: (msg = 'Forbidden') => new AppError('FORBIDDEN', msg),
};
