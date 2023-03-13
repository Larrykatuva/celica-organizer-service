import { SetMetadata } from '@nestjs/common';
import { ROLE } from '../../roles/role.entity';

/**
 * Decorator to allow specifying what roles are required to access specific resources.
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: ROLE[]) => SetMetadata(ROLES_KEY, roles);
