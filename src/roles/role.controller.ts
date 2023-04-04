import { ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import {
  RequestPaginationDecorator,
  SharedResponse,
} from '../shared/decorators/response.decorators';
import { CreateRoleDto, RoleResponseDto, UpdateRoleDto } from './role.dtos';
import { ORGANIZER_ROLES, ROLE, UserRole } from './role.entity';
import {
  ExtractRequestPagination,
  SharedQueryExtractor,
} from '../shared/decorators/query.decorators';
import { DefaultPagination } from '../shared/interfaces/pagination.interface';
import { AuthGuard } from '../shared/guards/auth.guard';
import { AuthRoles } from '../shared/decorators/roles.decorators';
import { ExtractRequestUser } from '../shared/decorators/user.decorators';
import { UserInfoResponse } from '../shared/interfaces/shared.interface';

@ApiTags('ROLE')
@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  @AuthRoles(ROLE.SUPER_ADMIN, ROLE.ORGANIZER_ADMIN)
  @SharedResponse(RoleResponseDto)
  async assignRole(
    @Body() role: CreateRoleDto,
    @ExtractRequestUser() user: UserInfoResponse,
  ): Promise<UserRole> {
    if (!(await this.roleService.isCelicaStaff(user.sub))) {
      if (![...ORGANIZER_ROLES, ROLE.ORGANIZER_USER].includes(role.role)) {
        throw new BadRequestException('Invalid user role');
      }
    }
    return await this.roleService.assignRole(role, user.sub);
  }

  @Get()
  @AuthRoles(ROLE.SUPER_ADMIN)
  @RequestPaginationDecorator(RoleResponseDto)
  async getUserRoles(
    @ExtractRequestPagination() pagination: DefaultPagination,
    @SharedQueryExtractor() query: any,
  ): Promise<[UserRole[], number]> {
    return await this.roleService.filterRoles(pagination, query);
  }

  @Get(':sub')
  @AuthRoles(ROLE.SUPER_ADMIN, ROLE.ORGANIZER_ADMIN)
  @SharedResponse(RoleResponseDto, 200)
  async getUserRole(@Param('sub') sub: string): Promise<UserRole> {
    return await this.roleService.filterRole({ user: { sub: sub } });
  }

  @Patch(':sub')
  @AuthRoles(ROLE.SUPER_ADMIN, ROLE.ORGANIZER_ADMIN)
  @SharedResponse(RoleResponseDto, 200)
  async updateUserRole(
    @ExtractRequestUser() user: UserInfoResponse,
    @Param('sub') sub: string,
    @Body() data: UpdateRoleDto,
  ): Promise<UserRole> {
    if (!(await this.roleService.isCelicaStaff(user.sub))) {
      if (![...ORGANIZER_ROLES, ROLE.ORGANIZER_USER].includes(data.role)) {
        throw new BadRequestException('Invalid user role');
      }
    }
    return await this.roleService.updateRole({ user: { sub: sub } }, data);
  }

  @Delete(':sub')
  @AuthRoles(ROLE.SUPER_ADMIN, ROLE.ORGANIZER_ADMIN)
  @SharedResponse(undefined, 204)
  @HttpCode(204)
  async revokeUserRole(@Param('sub') sub: string): Promise<void> {
    await this.roleService.deleteRole({ user: { user: sub } });
  }
}
