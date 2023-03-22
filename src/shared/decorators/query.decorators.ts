import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

const prepareQueryObject = (query: any[], queryObject: any) => {
  const objectKeys = query[0].split('__');
  if (objectKeys.length == 1) {
    queryObject[query[0]] = query[1];
  }
  objectKeys.reverse();
  let tempObject = {};
  for (let i = 0; i < objectKeys.length; i++) {
    if (i == 0) {
      tempObject[objectKeys[i]] = query[1];
    } else {
      const temp = {};
      queryObject[objectKeys[i]] = tempObject;
      temp[objectKeys[i]] = tempObject;
      tempObject = temp;
    }
  }
  return queryObject;
};

/**
 * Extract query parameters from the request query and format them in a way typeorm will understand.
 */
export const SharedQueryExtractor = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    let queryArray = Object.entries(request.query);
    const queryObject = {};
    const forDeletion = ['PageIndex', 'PageSize'];
    queryArray = queryArray.filter((item) => !forDeletion.includes(item[0]));
    for (let i = 0; i < queryArray.length; i++) {
      if (queryArray[i][0] != 'related_tables') {
        prepareQueryObject(queryArray[i], queryObject);
      }
    }
    return queryObject;
  },
);

/**
 * Extract query pagination filters. Set default offset = 0 and limit = 10 if not provided.
 */
export const ExtractRequestPagination = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    const {
      query: { PageIndex = 0, PageSize = 10 },
    } = request;
    return {
      skip: parseInt(PageIndex.toString()),
      take: PageSize > 50 ? 10 : parseInt(PageSize.toString()),
    };
  },
);
