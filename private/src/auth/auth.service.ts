import { BadRequestException, Injectable } from '@nestjs/common';
import * as grpc from '@grpc/grpc-js';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { User } from '../../common/entities/user.entity';
import { RedisService } from 'src/redis/redis.service';
import {
  CreateUserRequest,
  GetUserInfoRequest,
  LogoutUserRequest,
} from '../../common/interfaces/auth';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    // private readonly redisService: RedisService,
  ) {}

  async login(loginUserRequest: CreateUserRequest) {
    const { login, password } = loginUserRequest;
    const user = await this.userRepository.findOneBy({ login });

    if (!user) {
      throw new RpcException({
        code: grpc.status.UNAUTHENTICATED,
        message: 'login or password is incorrect',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new RpcException({
        code: grpc.status.UNAUTHENTICATED,
        message: 'login or password is incorrect',
      });
    }

    const tokens = await this.getTokens(user);

    const setDto = {
      key: `refresh_token_${user.id}`,
      value: tokens.refresh_token,
    };

    // await this.redisService.set(setDto);

    return tokens;
  }

  async signup(createUserRequest: CreateUserRequest) {
    const { login, password } = createUserRequest;

    const existingUser = await this.userRepository.findOneBy({ login });
    if (existingUser) {
      throw new RpcException({
        code: grpc.status.ALREADY_EXISTS,
        message: 'Login is already registered',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 7);
    const newUser = this.userRepository.create({
      login,
      password: hashedPassword,
      isActive: true,
    });
    await this.userRepository.save(newUser);
    return newUser;
  }

  async logout(logoutUserRequest: LogoutUserRequest): Promise<User> {
    const { refreshToken } = logoutUserRequest;
    const userData = await this.jwtService.decode(refreshToken);

    if (!userData) {
      throw new RpcException({
        code: grpc.status.UNAUTHENTICATED,
        message: 'Invalid token',
      });
    }

    const user = await this.userRepository.findOne({
      where: { id: userData.id },
    });
    if (!user) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'User not found',
      });
    }

    // const tokenExists = await this.redisService.get(
    //   `refresh_token_${userData.id}`,
    // );

    // if (!tokenExists) {
    //   throw new RpcException({
    //     code: grpc.status.UNAUTHENTICATED,
    //     message: 'Token not found',
    //   });
    // }

    // await this.redisService.del(`refresh_token_${userData.id}`);

    return user;
  }

  async getUserInfo(
    getUserInfoRequest: GetUserInfoRequest,
  ): Promise<Partial<User>> {
    const { id: userId } = getUserInfoRequest;

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { courses: true },
    });

    if (!user) {
      throw new BadRequestException();
    }

    Object.defineProperty(user, 'password', { enumerable: false });

    return user;
  }

  async getTokens(user: User) {
    let jwtPayload: any;

    jwtPayload = {
      id: user.id,
      login: user.login,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
