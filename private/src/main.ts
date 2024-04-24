import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { AppModule } from './app.module';

async function startPrivate() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: 'localhost:50050',
        package: ['auth', 'file', 'course'],
        protoPath: [
          join(__dirname, '../../protos/auth.proto'),
          join(__dirname, '../../protos/file.proto'),
          join(__dirname, '../../protos/course.proto'),
        ],
        maxSendMessageLength: 100 * 1024 * 1024,
        maxReceiveMessageLength: 100 * 1024 * 1024,
      },
    },
  );

  await app.listen();
}

startPrivate();
