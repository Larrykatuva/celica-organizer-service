import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ROLE } from '../../roles/role.entity';
import { RolesGuard } from '../guards/roles.guard';

/**
 * Decorator to allow specifying what roles are required to access specific resources.
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: ROLE[]) => SetMetadata(ROLES_KEY, roles);

/**
 * Universal decorator which combines roles decorator and auth guard decorator.
 * @param roles
 * @constructor
 */
export const AuthRoles = (...roles: ROLE[]) => {
  return applyDecorators(Roles(...roles), UseGuards(RolesGuard));
};
