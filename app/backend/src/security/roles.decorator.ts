import { SetMetadata } from '@nestjs/common';
import type { Role } from './rbac.guard';
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
