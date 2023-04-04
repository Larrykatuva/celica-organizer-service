import { ApiProperty } from '@nestjs/swagger';
import { CharField } from '../shared/decorators/dto.decorators';

export class CreateCountryDto {
  @CharField({ required: true })
  name: string;

  @CharField({ required: true })
  currency: string;

  @CharField({ required: true })
  code: string;

  @CharField({ required: true })
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
