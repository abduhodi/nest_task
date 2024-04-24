/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'auth';

export interface CreateUserRequest {
  login: string;
  password: string;
}

export interface CreateUserResponse {
  message: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface GetUserInfoRequest {
  id: number;
  login: string;
}

export interface User {
  id: number;
  login: string;
  password: string;
  isActive: boolean;
}

export interface LogoutUserRequest {
  refreshToken: string;
}

export const AUTH_PACKAGE_NAME = 'auth';

export interface UserServiceClient {
  createUser(request: CreateUserRequest): Observable<CreateUserResponse>;

  loginUser(request: CreateUserRequest): Observable<Tokens>;

  getUserInfo(request: GetUserInfoRequest): Observable<User>;

  updateTokens(request: LogoutUserRequest): Observable<Tokens>;

  logoutUser(request: LogoutUserRequest): Observable<CreateUserResponse>;
}

export interface UserServiceController {
  createUser(
    request: CreateUserRequest,
  ):
    | Promise<CreateUserResponse>
    | Observable<CreateUserResponse>
    | CreateUserResponse;

  loginUser(
    request: CreateUserRequest,
  ): Promise<Tokens> | Observable<Tokens> | Tokens;

  getUserInfo(
    request: GetUserInfoRequest,
  ): Promise<User> | Observable<User> | User;

  updateTokens(
    request: LogoutUserRequest,
  ): Promise<Tokens> | Observable<Tokens> | Tokens;

  logoutUser(
    request: LogoutUserRequest,
  ):
    | Promise<CreateUserResponse>
    | Observable<CreateUserResponse>
    | CreateUserResponse;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'createUser',
      'loginUser',
      'getUserInfo',
      'updateTokens',
      'logoutUser',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('UserService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('UserService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const USER_SERVICE_NAME = 'UserService';
