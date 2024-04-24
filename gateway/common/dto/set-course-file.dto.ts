import { IsArray, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { SetCourseFileRequest } from '../interfaces/course';

export class SetCourseFileDto implements SetCourseFileRequest {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  courseId: number;

  @IsArray()
  @IsNotEmpty()
  fileIds: number[];
}
