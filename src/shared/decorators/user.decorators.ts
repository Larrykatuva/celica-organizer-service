import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extract user details from the request user.
 */
export const ExtractRequestUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    return request['user'];
  },
);
