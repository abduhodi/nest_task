import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoursesModule } from './courses/courses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    CoursesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}