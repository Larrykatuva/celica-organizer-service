import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCountryDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  currency: string;

  @ApiProperty()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  timezone: string;
}

export class CountryResponseDto extends CreateCountryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class UpdateCountryDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  timezone: string;
}
