import { Module } from '@nestjs/common';
import { CoursesController } from './course.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { resolve } from 'path';
import {
  COURSE_SERVICE_NAME,
  protobufPackage,
} from '../../common/interfaces/course';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: COURSE_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: 'localhost:50050',
          package: protobufPackage,
          protoPath: resolve(__dirname, '../../protos/course.proto'),
        },
      },
    ]),
  ],

  controllers: [CoursesController],
  providers: [],
})
export class CoursesModule {}
