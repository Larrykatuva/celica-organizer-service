import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserInfoResponse } from '../../shared/interfaces/shared.interface';
import { OrganizerResponseDto } from './organizer.dtos';

export class CreateAffiliateDto {
  @ApiProperty()
  @IsNotEmpty()
  user: string;

  @ApiProperty()
  @IsNotEmpty()
  organizer: string;
}

export class SetAffiliateStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  status: boolean;
}

export class AffiliateResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user: UserInfoResponse;

  @ApiProperty()
  organizer: OrganizerResponseDto;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
