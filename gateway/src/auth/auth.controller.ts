import {
  Controller,
  Post,
  Body,
  OnModuleInit,
  Inject,
  Res,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';

import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Request, Response } from 'express';
import {
  CreateUserRequest,
  USER_SERVICE_NAME,
  UserServiceClient,
} from '../../common/interfaces/auth';
import { CookieGetter } from '../../common/decorators/cookieGetter.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController implements OnModuleInit {
  private usersService: UserServiceClient;

  constructor(@Inject(USER_SERVICE_NAME) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.usersService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  @Post('signup')
  async create(@Body() createUserRequest: CreateUserRequest) {
    try {
      return this.usersService.createUser(createUserRequest);
    } catch (error) {
      throw new InternalServerErrorException(error?.message);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginUserRequest: CreateUserRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const tokens = await firstValueFrom(
        this.usersService.loginUser(loginUserRequest),
      );
      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return tokens;
    } catch (error) {
      throw new InternalServerErrorException(error?.message);
    }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(
    @CookieGetter('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      await firstValueFrom(this.usersService.logoutUser({ refreshToken }));
      res.clearCookie('refreshToken');
      return { message: 'logged out successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error?.message);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get User Info' })
  @UseGuards(AuthGuard)
  @Get('getMe')
  getUserInfo(@Req() request: any) {
    return this.usersService.getUserInfo(request?.user);
  }
}
