import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { CommonResponseDto } from '../dto/pagination.dto';
import { map, Observable } from 'rxjs';
import { Request } from 'express';

const prepareQueryParams = (request: Request): string | null => {
  let queryString = '';
  const queryArray = Object.entries(request.query);
  for (let i = 0; i < queryArray.length; i++) {
    queryString += `&${queryArray[i][0]}=${queryArray[i][1]}`;
  }
  return queryString;
};

/**
 * Prepare next url with its query parameters.
 * @param count
 * @param pagination
 * @param request
 */
const prepareNextUrl = (
  count: number,
  pagination: { take: number; skip: number },
  request: Request,
): string | null => {
  const nextIndex = pagination.skip + pagination.take;
  if (nextIndex >= count) {
    return null;
  }
  const relativeUrl = request.route.path;
  return (
    relativeUrl +
    request['baseUrl'] +
    `?PageSize=${pagination.take}&PageIndex=${nextIndex}` +
    prepareQueryParams(request)
  );
};

/**
 * Prepare previous url with its query parameters.
 * @param count
 * @param pagination
 * @param request
 */
const preparePreviousUrl = (
  count: number,
  pagination: { take: number; skip: number },
  request: Request,
): string | null => {
  if (pagination.skip == 0) return null;
  const previousIndex = pagination.skip - pagination.take;
  if (previousIndex < 0) return null;
  const relativeUrl = request.route.path;
  return (
    relativeUrl +
    request['baseUrl'] +
    `?PageSize=${pagination.take}&PageIndex=${previousIndex}` +
    prepareQueryParams(request)
  );
};

/**
 * Transform all paginated data responses to a common data standardization.
 */
@Injectable()
export class PaginationInterceptor<T>
  implements NestInterceptor<T, CommonResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<CommonResponseDto<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const {
      query: { PageIndex = 0, PageSize = 10 },
    } = request;
    return next.handle().pipe(
      map((data) => ({
        count: data[1],
        next: prepareNextUrl(
          data[1],
          {
            take: parseInt(PageSize.toString()),
            skip: parseInt(PageIndex.toString()),
          },
          request,
        ),
        previous: preparePreviousUrl(
          data[1],
          {
            take: parseInt(PageSize.toString()),
            skip: parseInt(PageIndex.toString()),
          },
          request,
        ),
        data: data[0],
      })),
    );
  }
}
