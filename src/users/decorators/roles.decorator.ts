import { SetMetadata } from '@nestjs/common';
import { Role } from '../models/role.enum';

// https://docs.nestjs.com/guards#setting-roles-per-handler
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
