import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from './role.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateRoleDto } from './role.dtos';
import { UserService } from '../shared/services/user.service';
import { DefaultPagination } from '../shared/interfaces/pagination.interface';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(UserRole) private roleRepository: Repository<UserRole>,
    private userService: UserService,
  ) {}

  async filterRole(filterOptions: any): Promise<UserRole | null> {
    try {
      return await this.roleRepository.findOneBy({ ...filterOptions });
    } catch (error) {
      return null;
    }
  }

  async filterRecords(filterOptions: any): Promise<UserRole[]> {
    return await this.roleRepository.find({ where: { ...filterOptions } });
  }

  async assignRole(role: CreateRoleDto, assignedBy: string): Promise<UserRole> {
    if (await this.filterRole({ role: role.role, user: { id: role.user } }))
      throw new BadRequestException('This role is already assigned this role');
    role['user'] = await this.userService.filterUser({ sub: role.user });
    role['assignedBy'] = await this.userService.filterUser({ sub: assignedBy });
    return await this.roleRepository.save(role);
  }

  async filterRoles(
    pagination: DefaultPagination,
    queryOptions?: any,
    options?: any,
  ): Promise<[UserRole[], number]> {
    try {
      return await this.roleRepository.findAndCount({
        ...pagination,
        where: { ...queryOptions },
        ...options,
      });
    } catch (error) {
      return [[], 0];
    }
  }

  async updateRole(filterOptions: any, updateFields: any): Promise<UserRole> {
    await this.roleRepository.update({ ...filterOptions }, { ...updateFields });
    return await this.filterRole(filterOptions);
  }

  async deleteRole(filterOptions): Promise<DeleteResult> {
    return await this.roleRepository.delete({ ...filterOptions });
  }
}
