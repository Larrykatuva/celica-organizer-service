import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ROLE } from './role.entity';

export class CreateRoleDto {
  @ApiProperty({ type: 'enum', default: ROLE.CLIENT_USER })
  @IsNotEmpty()
  role: ROLE;

  @ApiProperty()
  @IsNotEmpty()
  user: string | any;
}

export class RoleResponseDto extends CreateRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  assignedBy: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class UpdateRoleDto {
  @ApiProperty({ type: 'enum', default: ROLE.CLIENT_USER })
  role: ROLE;
}
