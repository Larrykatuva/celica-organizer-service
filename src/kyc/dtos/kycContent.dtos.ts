import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { KycField } from './kycMapping.dtos';
import { KycMapping } from '../entities/kycMapping.entity';
import { Organizer } from '../../organizer/entity/organizer.entity';

export class CreateKycContent {
  @ApiProperty()
  @IsNotEmpty()
  kycMapping: string | KycMapping;

  @ApiProperty()
  organizer: string | Organizer;

  @ApiProperty()
  field1: KycField;

  @ApiProperty()
  field2: KycField;

  @ApiProperty()
  field3: KycField;

  @ApiProperty()
  field4: KycField;

  @ApiProperty()
  field5: KycField;

  @ApiProperty()
  field6: KycField;

  @ApiProperty()
  field7: KycField;

  @ApiProperty()
  field8: KycField;

  @ApiProperty()
  field9: KycField;

  @ApiProperty()
  field10: KycField;
}
