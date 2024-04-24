/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "course";

export interface CreateCourseRequest {
  title: string;
  description: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
}

export interface Empty {
}

export interface Courses {
  courses: Course[];
}

export interface FindOneCourseRequest {
  id: number;
}

export interface UpdateCourseRequest {
  id: number;
  title: string;
  description: string;
}

export interface PaginationRequest {
  page: number;
  skip: number;
}

export interface SetCourseFileRequest {
  courseId: number;
  fileIds: number[];
}

export interface SetCourseFileResponse {
  course: Course | undefined;
  files: File[];
}

export interface File {
  id: number;
  fileName: string;
  extension: string;
  fileSize: number;
  filePath: string;
}

export const COURSE_PACKAGE_NAME = "course";

export interface CourseServiceClient {
  createCourse(request: CreateCourseRequest): Observable<Course>;

  findAllCourses(request: Empty): Observable<Courses>;

  findOneCourse(request: FindOneCourseRequest): Observable<Course>;

  updateCourse(request: UpdateCourseRequest): Observable<Course>;

  removeCourse(request: FindOneCourseRequest): Observable<Course>;

  queryCourse(request: Observable<PaginationRequest>): Observable<Course>;

  setCourseFile(request: SetCourseFileRequest): Observable<SetCourseFileResponse>;

  removeFilesFromCourse(request: SetCourseFileRequest): Observable<SetCourseFileResponse>;
}

export interface CourseServiceController {
  createCourse(request: CreateCourseRequest): Promise<Course> | Observable<Course> | Course;

  findAllCourses(request: Empty): Promise<Courses> | Observable<Courses> | Courses;

  findOneCourse(request: FindOneCourseRequest): Promise<Course> | Observable<Course> | Course;

  updateCourse(request: UpdateCourseRequest): Promise<Course> | Observable<Course> | Course;

  removeCourse(request: FindOneCourseRequest): Promise<Course> | Observable<Course> | Course;

  queryCourse(request: Observable<PaginationRequest>): Observable<Course>;

  setCourseFile(
    request: SetCourseFileRequest,
  ): Promise<SetCourseFileResponse> | Observable<SetCourseFileResponse> | SetCourseFileResponse;

  removeFilesFromCourse(
    request: SetCourseFileRequest,
  ): Promise<SetCourseFileResponse> | Observable<SetCourseFileResponse> | SetCourseFileResponse;
}

export function CourseServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createCourse",
      "findAllCourses",
      "findOneCourse",
      "updateCourse",
      "removeCourse",
      "setCourseFile",
      "removeFilesFromCourse",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("CourseService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = ["queryCourse"];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("CourseService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const COURSE_SERVICE_NAME = "CourseService";
