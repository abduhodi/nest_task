import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join, resolve } from 'path';
import { FilesController } from './file.controller';
import {
  FILE_SERVICE_NAME,
  protobufPackage,
} from '../../common/interfaces/file';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: FILE_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: 'localhost:50050',
          package: protobufPackage,
          protoPath: resolve(__dirname, '../../protos/file.proto'),
        },
      },
    ]),
    JwtModule,
  ],

  controllers: [FilesController],
  providers: [],
})
export class FilesModule {}
