import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Omit } from '../../shared/dto/utils.dto';
import { CountryResponseDto } from '../../country/country.dtos';
import { Country } from '../../country/country.entity';
import { Expose, plainToClass, Transform } from 'class-transformer';

export enum KycFieldType {
  FILE = 'FILE',
  TEXT = 'TEXT',
}

export class KycField {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: 'enum', enum: KycFieldType })
  @IsNotEmpty()
  type: KycFieldType;

  @ApiProperty({ type: 'boolean', default: false })
  required: boolean;
}

export class CreateKycMapping {
  @ApiProperty()
  @IsNotEmpty()
  country: string | Country;

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

export class KycMappingResponseDto extends Omit(CreateKycMapping, ['country']) {
  @ApiProperty()
  id: string;

  @ApiProperty()
  country: CountryResponseDto;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class UpdateKycMappingDto extends Omit(CreateKycMapping, ['country']) {
  @ApiProperty()
  country: string | any;
}
