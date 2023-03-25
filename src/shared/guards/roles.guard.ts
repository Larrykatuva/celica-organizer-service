import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE, UserRole } from '../../roles/role.entity';
import { ROLES_KEY } from '../decorators/roles.decorators';
import { Request } from 'express';
import { RoleService } from '../../roles/role.service';
import { User } from '../entities/user.entity';

/**
 * RolesGuard class which will compare the roles assigned to the current user
 * to the actual roles required by the current route being processed.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rolesService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ROLE[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const user: User = request['user'];
    const roles = await this.rolesService.filterRecords({
      user: { sub: user.sub },
    });
    const setRoles = roles.map((role) => role.role);
    return requiredRoles.some((role) => setRoles?.includes(role));
  }
}
