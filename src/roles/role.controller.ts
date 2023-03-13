import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RoleService } from './role.service';
import {
  SharedPaginatedResponse,
  SharedResponse,
} from '../shared/decorators/response.decorators';
import { CreateRoleDto, RoleResponseDto, UpdateRoleDto } from './role.dtos';
import { UserRole } from './role.entity';
import {
  ExtractRequestPagination,
  SharedQueryExtractor,
} from '../shared/decorators/query.decorators';
import { DefaultPagination } from '../shared/interfaces/pagination.interface';

@ApiTags('ROLE')
@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  @SharedResponse(RoleResponseDto)
  async assignRole(@Body() role: CreateRoleDto): Promise<UserRole> {
    return await this.roleService.assignRole(role, 'ii');
  }

  @Get()
  @SharedPaginatedResponse(RoleResponseDto)
  async getUserRoles(
    @ExtractRequestPagination() pagination: DefaultPagination,
    @SharedQueryExtractor() query: any,
  ): Promise<[UserRole[], number]> {
    return await this.roleService.filterRoles(pagination, query);
  }

  @Get(':sub')
  @SharedResponse(RoleResponseDto, 200)
  async getUserRole(@Param('sub') sub: string): Promise<UserRole> {
    return await this.roleService.filterRole({ user: { sub: sub } });
  }

  @Patch(':sub')
  @SharedResponse(RoleResponseDto, 200)
  async updateUserRole(
    @Param('sub') sub: string,
    @Body() data: UpdateRoleDto,
  ): Promise<UserRole> {
    return await this.roleService.updateRole({ user: { sub: sub } }, data);
  }

  @Delete(':sub')
  @SharedResponse(undefined, 204)
  @HttpCode(204)
  async revokeUserRole(@Param('sub') sub: string): Promise<void> {
    await this.roleService.deleteRole({ user: { user: sub } });
  }
}
