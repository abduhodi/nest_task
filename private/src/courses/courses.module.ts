import { Module } from '@nestjs/common';
import { CoursesService } from './course.service';
import { CoursesController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'common/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
