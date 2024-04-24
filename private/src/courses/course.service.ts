import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RpcException } from '@nestjs/microservices';
import * as grpc from '@grpc/grpc-js';
import { Course } from 'common/entities/course.entity';
import {
  CreateCourseRequest,
  FindOneCourseRequest,
  SetCourseFileRequest,
  SetCourseFileResponse,
  UpdateCourseRequest,
} from 'common/interfaces/course';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    // private readonly fileService: FilesService,
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

  async findAll(): Promise<{ courses: Course[] }> {
    const courses = await this.courseRepository.find();
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

  // async addFilesToCourse(
  //   setCourseFileRequest: SetCourseFileRequest,
  // ): Promise<SetCourseFileResponse> {
  //   const { courseId, fileIds } = setCourseFileRequest;
  //   const course = await this.courseRepository.findOne({
  //     where: { id: courseId },
  //     relations: ['files'],
  //   });

  //   if (!course) {
  //     throw new RpcException({
  //       code: grpc.status.NOT_FOUND,
  //       message: 'Course not found',
  //     });
  //   }

  //   const newFiles = await this.fileService.getFileByRelation(fileIds);
  //   const existingFileIds = course.files.map((file) => file.id);
  //   const updatedFiles = [
  //     ...course.files,
  //     ...newFiles.filter((file) => !existingFileIds.includes(file.id)),
  //   ];

  //   course.files = updatedFiles;
  //   const updatedCourse = await this.courseRepository.save(course);

  //   return {
  //     course: course,
  //     files: updatedCourse.files,
  //   };
  // }

  async removeFilesFromCourse(
    setCourseFileRequest: SetCourseFileRequest,
  ): Promise<SetCourseFileResponse> {
    const { courseId, fileIds } = setCourseFileRequest;
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['files'],
    });

    if (!course) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'Course not found',
      });
    }

    const existingFileIds = course.files.map((file) => file.id);
    const missingFileIds = fileIds.filter(
      (fileId) => !existingFileIds.includes(fileId),
    );

    if (missingFileIds.length > 0) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: `Files with IDs ${missingFileIds.join(', ')} not found in the course`,
      });
    }

    course.files = course.files.filter((file) => !fileIds.includes(file.id));
    const updatedCourse = await this.courseRepository.save(course);

    return {
      course: course,
      files: updatedCourse.files,
    };
  }
}
