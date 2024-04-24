import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import {
  CreateUserRequest,
  GetUserInfoRequest,
  LogoutUserRequest,
  USER_SERVICE_NAME,
} from '../../common/interfaces/auth';

@Controller()
export class AuthController {
  constructor(private readonly usersService: AuthService) {}

  @GrpcMethod(USER_SERVICE_NAME, 'CreateUser')
  signup(@Payload() createUserRequest: CreateUserRequest) {
    return this.usersService.signup(createUserRequest);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'LoginUser')
  login(@Payload() loginUserRequest: CreateUserRequest) {
    return this.usersService.login(loginUserRequest);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'LogoutUser')
  logout(@Payload() logoutUserRequest: LogoutUserRequest) {
    return this.usersService.logout(logoutUserRequest);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetUserInfo')
  getUserInfo(@Payload() getUserRequest: GetUserInfoRequest) {
    return this.usersService.getUserInfo(getUserRequest);
  }

  // @GrpcMethod(USER_SERVICE_NAME, 'UpdateTokens')
  // updateTokens(@Payload() updateTokenRequest: LogoutUserRequest) {
  //   return this.usersService.updateTokens(updateTokenRequest);
  // }
}
