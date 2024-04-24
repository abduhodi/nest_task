import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { CreateCourseRequest } from '../interfaces/course';

export class CreateCourseDto implements CreateCourseRequest {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  description: string;
}
