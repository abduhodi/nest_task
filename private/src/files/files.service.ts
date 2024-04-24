import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import * as grpc from '@grpc/grpc-js';
import * as uuid from 'uuid';
import {
  CreateFileRequest,
  FindOneFileRequest,
  UpdateFileRequest,
} from '../../common/interfaces/file';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { File } from '../../common/entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File) private fileRepository: Repository<File>,
    private readonly configService: ConfigService,
  ) {}

  async create(createFileRequest: CreateFileRequest) {
    try {
      const { file } = createFileRequest;

      console.log(createFileRequest, 'file request');

      const newFile = await this.uploadAWS(file);

      return newFile;
    } catch (error) {
      console.log(error);
      throw new RpcException({
        code: grpc.status.INTERNAL,
        message: 'File creation failed',
      });
    }
  }

  async findAllFiles(): Promise<{ files: File[] }> {
    const files = await this.fileRepository.find({});
    return { files };
  }

  async findOne(findOneRequest: FindOneFileRequest): Promise<File> {
    const { id } = findOneRequest;
    const file = await this.fileRepository.findOneBy({ id });
    if (!file) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: `File with ID ${id} not found`,
      });
    }
    return file;
  }

  async update(updateFileRequest: UpdateFileRequest): Promise<File> {
    const { id } = updateFileRequest;
    const file = await this.findOne({ id: id });
    this.fileRepository.merge(file, updateFileRequest);
    return await this.fileRepository.save(file);
  }

  async remove(findOneRequest: FindOneFileRequest): Promise<File> {
    const { id } = findOneRequest;
    const file = await this.findOne({ id: id });
    await this.fileRepository.remove(file);
    return file;
  }

  async getFileByRelation(fileIds: number[]): Promise<File[]> {
    const files = await this.fileRepository.find({
      where: { id: In(fileIds) },
      relations: ['courses'],
    });

    if (!files.length) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'File not found',
      });
    }

    return files;
  }

  private readonly s3 = new S3Client({
    region: this.configService.getOrThrow<string>('AWS_S3_REGION'),
    credentials: {
      accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY'),
      secretAccessKey: this.configService.getOrThrow<string>(
        'AWS_SECRET_ACCESS_KEY',
      ),
    },
  });

  async uploadAWS(file: any): Promise<string> {
    const file_types = ['jpg', 'jpeg', 'png'];
    if (file_types.includes(file.mimetype.split('/')[1])) {
    } else {
      throw new BadRequestException('File with such type not allowed');
    }

    try {
      const fileName = uuid.v4() + `.${file.mimetype.split('/')[1]}`;
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.configService.getOrThrow<string>('AWS_BUCKET'),
          Key: `images/${fileName}`,
          Body: file?.buffer,
          ACL: 'private',
        }),
      );

      return this.configService.getOrThrow('AWS_BUCKET_URL') + fileName;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
