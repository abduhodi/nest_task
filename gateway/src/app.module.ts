import { Module } from '@nestjs/common';
import { CoursesModule } from './course/course.module';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GrpcErrorInterceptor } from '../common/errors/error-grpc';
import { FilesModule } from './file/file.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    CoursesModule,
    FilesModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: GrpcErrorInterceptor,
    },
  ],
})
export class AppModule {}
