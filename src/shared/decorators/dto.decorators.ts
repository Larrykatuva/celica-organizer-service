import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { MaxLength, MinLength } from 'class-validator';

/**
 * Unified swagger api property which combines functionalities and class-validator functionalities.
 * @param options
 * @param maxLength
 * @param minLength
 * @constructor
 */
export const CharField = (
  options?: ApiPropertyOptions,
  maxLength = 256,
  minLength = 0,
) => {
  return applyDecorators(
    ApiProperty(options),
    MaxLength(maxLength),
    MinLength(minLength),
  );
};
