import {
  HttpException,
  HttpStatus,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { Agent, AgentOptions } from 'https';
import { catchError, lastValueFrom } from 'rxjs';
import * as qs from 'qs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { RequestContentType } from '../interfaces/shared.interface';

@Injectable()
export class RequestService {
  private contentType: string = null;

  constructor(public httpService: HttpService) {
    this.contentType = RequestContentType.JSON;
  }

  /**
   * Set request content type else the default type will be set to application/json
   * @param contentType
   */
  setContentType(contentType: string): void {
    switch (contentType) {
      case RequestContentType.FORM_DATA:
        throw new NotImplementedException();
      case RequestContentType.FORM_URLENCODED:
        this.contentType = RequestContentType.FORM_URLENCODED;
        break;
      case RequestContentType.JSON:
        this.contentType = RequestContentType.JSON;
        break;
      default:
        throw new HttpException(
          'Invalid request content type',
          HttpStatus.BAD_REQUEST,
        );
    }
  }

  /**
   * Prepare the request body depending on the set content type.
   * @param payload
   * @private
   */
  private prepareRequestBody(payload: any): any {
    switch (this.contentType) {
      case RequestContentType.JSON:
        return payload;
      case RequestContentType.FORM_URLENCODED:
        return qs.stringify(payload);
      default:
        break;
    }
  }

  /**
   * Handle patch request method.
   * @param url
   * @param payload
   * @param contentType
   * @param token
   * @param options
   */
  async patchRequest<T>(
    url: string,
    payload: any,
    contentType: string = RequestContentType.JSON,
    token?: string,
    options?: any,
  ): Promise<any> {
    this.setContentType(contentType);
    const httpsAgent: AgentOptions = new Agent({ rejectUnauthorized: false });
    const { status, data } = await lastValueFrom(
      this.httpService
        .patch<T>(url, this.prepareRequestBody(payload), {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': this.contentType
              ? this.contentType
              : RequestContentType.JSON,
            ...options,
          },
          httpsAgent,
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(
              error.response
                ? error.response.data
                : 'An error occurred while making the request',
              HttpStatus.BAD_REQUEST,
            );
          }),
        ),
    );
    return { status, data };
  }

  /**
   * Handle post request method.
   * @param url
   * @param payload
   * @param contentType
   * @param token
   * @param options
   */
  async postRequest<T>(
    url: string,
    payload: any,
    contentType: string = RequestContentType.JSON,
    token?: string,
    options?: any,
  ): Promise<any> {
    this.setContentType(contentType);
    const httpsAgent: AgentOptions = new Agent({ rejectUnauthorized: false });
    const { status, data } = await lastValueFrom(
      this.httpService
        .post<T>(url, this.prepareRequestBody(payload), {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': this.contentType
              ? this.contentType
              : RequestContentType.JSON,
            ...options,
          },
          httpsAgent,
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(
              error.response
                ? error.response.data
                : 'An error occurred while making the request',
              HttpStatus.BAD_REQUEST,
            );
          }),
        ),
    );
    return { status, data };
  }

  /**
   * Handle get requests.
   * @param url
   * @param token
   * @param options
   */
  async getRequest<T>(
    url: string,
    token?: string,
    options?: any,
  ): Promise<any> {
    const httpsAgent: AgentOptions = new Agent({ rejectUnauthorized: false });
    const { status, data } = await lastValueFrom(
      this.httpService
        .get<T>(url, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': RequestContentType.JSON,
            ...options,
          },
          httpsAgent,
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(
              error.response
                ? error.response.data
                : 'An error occurred while making the request',
              HttpStatus.BAD_REQUEST,
            );
          }),
        ),
    );
    return { status, data };
  }
}
