// Re-export the real UsersService from the src directory.
// This file used to be a stub, but having a stub here causes confusion during imports.
// To ensure the correct implementation is used, we simply re-export everything from
// the actual service defined under `src/users/users.service.ts`.
export * from '../src/users/users.service';
