import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {
  COURSE_SERVICE_NAME,
  CreateCourseRequest,
  FindOneCourseRequest,
  SetCourseFileRequest,
  UpdateCourseRequest,
} from '../../common/interfaces/course';
import { CoursesService } from './course.service';

@Controller()
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @GrpcMethod(COURSE_SERVICE_NAME, 'createCourse')
  create(@Payload() createCourseRequest: CreateCourseRequest) {
    return this.coursesService.create(createCourseRequest);
  }

  @GrpcMethod(COURSE_SERVICE_NAME, 'findAllCourses')
  findAll() {
    return this.coursesService.findAll();
  }

  @GrpcMethod(COURSE_SERVICE_NAME, 'findOneCourse')
  findOne(@Payload() findOneCourseRequest: FindOneCourseRequest) {
    return this.coursesService.findOne(findOneCourseRequest);
  }

  @GrpcMethod(COURSE_SERVICE_NAME, 'updateCourse')
  update(@Payload() updateCourseDto: UpdateCourseRequest) {
    return this.coursesService.update(updateCourseDto);
  }

  @GrpcMethod(COURSE_SERVICE_NAME, 'removeCourse')
  remove(@Payload() findOneCourseRequest: FindOneCourseRequest) {
    try {
      return this.coursesService.remove(findOneCourseRequest);
    } catch (error) {}
  }

  // @GrpcMethod(COURSE_SERVICE_NAME, 'setCourseFile')
  // addFilesToCourse(@Payload() setCourseFileRequest: SetCourseFileRequest) {
  //   return this.coursesService.addFilesToCourse(setCourseFileRequest);
  // }

  @GrpcMethod(COURSE_SERVICE_NAME, 'removeFilesFromCourse')
  removeFilesFromCourse(@Payload() setCourseFileRequest: SetCourseFileRequest) {
    return this.coursesService.removeFilesFromCourse(setCourseFileRequest);
  }
}
