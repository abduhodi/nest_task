import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  protobufPackage,
  USER_SERVICE_NAME,
} from '../../common/interfaces/auth';
import { resolve } from 'path';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: USER_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: 'localhost:50050',
          package: protobufPackage,
          protoPath: resolve(__dirname, '../../protos/auth.proto'),
        },
      },
    ]),
    JwtModule,
  ],

  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
