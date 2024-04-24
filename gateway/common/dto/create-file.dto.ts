import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { CreateFileRequest } from '../interfaces/file';

export class CreateFileDto implements CreateFileRequest {
  @MinLength(3)
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  fileName: string;

  file: any;
  fileType: string;
}
