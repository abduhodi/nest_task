import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { FilesService } from './files.service';
import {
  CreateFileRequest,
  FILE_SERVICE_NAME,
  FileServiceController,
  FindOneFileRequest,
  UpdateFileRequest,
} from '../../common/interfaces/file';

@Controller()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @GrpcMethod(FILE_SERVICE_NAME, 'createFile')
  create(@Payload() createFileRequest: CreateFileRequest) {
    return this.filesService.create(createFileRequest);
  }

  @GrpcMethod(FILE_SERVICE_NAME, 'findAllFiles')
  findAllFiles() {
    console.log('find all');
    return this.filesService.findAllFiles();
  }

  @GrpcMethod(FILE_SERVICE_NAME, 'findOneFile')
  findOne(@Payload() findOneRequest: FindOneFileRequest) {
    return this.filesService.findOne(findOneRequest);
  }

  @GrpcMethod(FILE_SERVICE_NAME, 'updateFile')
  update(@Payload() updateFileRequest: UpdateFileRequest) {
    return this.filesService.update(updateFileRequest);
  }

  @GrpcMethod(FILE_SERVICE_NAME, 'removeFile')
  remove(@Payload() findOneRequest: FindOneFileRequest) {
    return this.filesService.remove(findOneRequest);
  }
}
