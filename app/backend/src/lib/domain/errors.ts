export class DomainError extends Error {
  constructor(public code: string, message: string) { super(message); this.name = 'DomainError'; }
}
export class ValidationError extends DomainError {
  constructor(message: string, public field?: string) { super('VALIDATION', message); }
}
export class AuthFailedError extends DomainError {
  constructor() { super('AUTH_FAILED', 'نام کاربری یا گذرواژه نامعتبر است'); }
}
export class ForbiddenError extends DomainError {
  constructor(message = 'دسترسی مجاز نیست') { super('FORBIDDEN', message); }
}
