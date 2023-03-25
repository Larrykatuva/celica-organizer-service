import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from './role.entity';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([UserRole]), CqrsModule],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RolesModule {}
