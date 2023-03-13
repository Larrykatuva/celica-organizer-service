import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Resource forbidden custom exception.
 */
export class ResourceForbiddenException extends HttpException {
  constructor(message?: string) {
    super(message ? message : 'Forbidden', HttpStatus.FORBIDDEN);
  }
}

/**
 * Resource not found custom exception.
 */
export class ResourceNotFoundException extends HttpException {
  constructor(resource?: string) {
    super(
      `${resource ? resource : 'Resource'} not found exception`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
