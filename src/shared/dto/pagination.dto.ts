/**
 * Forbidden response
 */
import { ApiProperty } from '@nestjs/swagger';

export class ForbiddenResponse {
  @ApiProperty()
  status: string;

  @ApiProperty()
  message: string[];
}

/**
 * Bad request response
 */
export class BadRequestResponse {
  @ApiProperty()
  status: string;

  @ApiProperty()
  message: string[];
}

export class CommonResponseDto<T> {
  @ApiProperty()
  count: number;

  @ApiProperty()
  next?: string;

  @ApiProperty()
  previous?: string;

  @ApiProperty()
  data: T[];
}


