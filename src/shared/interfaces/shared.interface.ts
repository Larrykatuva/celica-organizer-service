import { USER } from '../dto/auth.dto';

export enum TCP_Action {
  UPDATE = 'UPDATE',
  CREATE = 'CREATE',
  DELETE = 'DELETE',
}

export interface TransportAction<T> {
  action: TCP_Action;
  data?: T;
}

export interface WalletResponse<T> {
  status: number;
  data: T;
}

export enum RequestContentType {
  FORM_URLENCODED = 'application/x-www-form-urlencoded',
  FORM_DATA = 'multipart/form-data',
  JSON = 'application/json',
}

export enum GRANT_TYPE {
  CLIENT_CREDENTIALS = 'client_credentials',
}

export interface TokenInterface {
  access_token: string;
  token_type: string;
  expires_in: string;
}

export interface TokenVerifyResponse {
  active: boolean;
  iat: number;
  exp: number;
  type: USER;
}

export interface UserInfoResponse {
  email: string;
  firstName: string;
  lastName: string;
  sub: string;
  app: string;
  iat: number;
  exp: number;
}
