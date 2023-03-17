import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizerDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  logo: string;

  @ApiProperty()
  @IsNotEmpty()
  country: string | any;

  @ApiProperty()
  owner: string | any;
}

export class OrganizerResponseDto extends CreateOrganizerDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class UpdateOrganizerDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  logo: string;
}
