import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RpcException } from '@nestjs/microservices';
import * as grpc from '@grpc/grpc-js';
import { Course } from '../../common/entities/course.entity';
import {
  CreateCourseRequest,
  FindAllCourseRequest,
  FindOneCourseRequest,
  UpdateCourseRequest,
} from '../../common/interfaces/course';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private courseRepository: Repository<Course>,
  ) {}

  async create(createCourseRequest: CreateCourseRequest): Promise<Course> {
    try {
      const { title } = createCourseRequest;

      const courseCheck = await this.courseRepository.findOneBy({ title });
      if (courseCheck) {
        throw new RpcException({
          code: grpc.status.ALREADY_EXISTS,
          message: 'Course already exists',
        });
      }

      const newCourse = this.courseRepository.create(createCourseRequest);
      await this.courseRepository.save(newCourse);

      return newCourse;
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        code: grpc.status.INTERNAL,
        message: 'Internal server error',
      });
    }
  }

  async findAll(
    findAllCourseRequest: FindAllCourseRequest,
  ): Promise<{ courses: Course[] }> {
    const { page, skip } = findAllCourseRequest;
    const courses = await this.courseRepository.find({
      skip: (page - 1) * skip,
      take: skip,
    });
    return { courses };
  }

  async findOne(findOneCourseRequest: FindOneCourseRequest): Promise<Course> {
    const { id } = findOneCourseRequest;
    const course = await this.courseRepository.findOneBy({ id });

    if (!course) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'Course not found',
      });
    }

    return course;
  }

  async update(updateCourseRequest: UpdateCourseRequest): Promise<Course> {
    const { id, ...updateData } = updateCourseRequest;
    const course = await this.courseRepository.findOneBy({ id });

    if (!course) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'Course not found',
      });
    }

    this.courseRepository.merge(course, updateData);
    const updatedCourse = await this.courseRepository.save(course);

    return updatedCourse;
  }

  async remove(findOneCourseRequest: FindOneCourseRequest): Promise<Course> {
    const { id } = findOneCourseRequest;
    const course = await this.courseRepository.findOneBy({ id });

    if (!course) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'Course not found',
      });
    }

    await this.courseRepository.remove(course);
    return course;
  }
}
