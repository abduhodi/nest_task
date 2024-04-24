/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "file";

export interface File {
  id: number;
  fileName: string;
  extension: string;
  fileSize: number;
  filePath: string;
}

export interface CreateFileRequest {
  fileName: string;
  file: Uint8Array;
  fileType: string;
}

export interface Empty {
}

export interface Files {
  files: File[];
}

export interface FindOneFileRequest {
  id: number;
}

export interface UpdateFileRequest {
  id: number;
  fileName: string;
}

export interface PaginationRequest {
  page: number;
  skip: number;
}

export const FILE_PACKAGE_NAME = "file";

export interface FileServiceClient {
  createFile(request: CreateFileRequest): Observable<File>;

  findAllFiles(request: Empty): Observable<Files>;

  findOneFile(request: FindOneFileRequest): Observable<File>;

  updateFile(request: UpdateFileRequest): Observable<File>;

  removeFile(request: FindOneFileRequest): Observable<File>;

  queryFile(request: Observable<PaginationRequest>): Observable<File>;
}

export interface FileServiceController {
  createFile(request: CreateFileRequest): Promise<File> | Observable<File> | File;

  findAllFiles(request: Empty): Promise<Files> | Observable<Files> | Files;

  findOneFile(request: FindOneFileRequest): Promise<File> | Observable<File> | File;

  updateFile(request: UpdateFileRequest): Promise<File> | Observable<File> | File;

  removeFile(request: FindOneFileRequest): Promise<File> | Observable<File> | File;

  queryFile(request: Observable<PaginationRequest>): Observable<File>;
}

export function FileServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createFile", "findAllFiles", "findOneFile", "updateFile", "removeFile"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("FileService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = ["queryFile"];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("FileService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const FILE_SERVICE_NAME = "FileService";
