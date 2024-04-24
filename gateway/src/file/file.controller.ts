import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  OnModuleInit,
  Inject,
  Body,
  Put,
  UseInterceptors,
  UploadedFile,
  InternalServerErrorException,
  UploadedFiles,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  CreateFileRequest,
  FILE_SERVICE_NAME,
  FileServiceClient,
  UpdateFileRequest,
} from '../../common/interfaces/file';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'common/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('file')
export class FilesController implements OnModuleInit {
  private filesService: FileServiceClient;

  constructor(@Inject(FILE_SERVICE_NAME) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.filesService =
      this.client.getService<FileServiceClient>(FILE_SERVICE_NAME);
  }

  @ApiOperation({ summary: 'Upload files' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  @Post('upload')
  create(
    @Body() createFileRequest: CreateFileRequest,
    @UploadedFiles() files: any,
  ) {
    try {
      console.log(createFileRequest, 'File dto...');
      console.log(files, 'Files...');
      return this.filesService.createFile({
        ...createFileRequest,
        file: files,
      });
    } catch (error) {
      throw new InternalServerErrorException(error?.message);
    }
  }

  @Get('get-all')
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    try {
      page = isNaN(+page) || +page < 1 ? 1 : +page;
      limit = isNaN(+limit) || +limit < 0 ? 0 : +limit;
      return this.filesService.findAllFiles({ page, limit });
    } catch (error) {
      throw new InternalServerErrorException(error?.message);
    }
  }

  @Get('get/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.filesService.findOneFile({ id });
    } catch (error) {
      throw new InternalServerErrorException(error?.message);
    }
  }

  @Put('update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFileRequest: UpdateFileRequest,
  ) {
    try {
      return this.filesService.updateFile({ id, ...updateFileRequest });
    } catch (error) {
      throw new InternalServerErrorException(error?.message);
    }
  }

  @Delete('delete/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.filesService.removeFile({ id });
    } catch (error) {
      throw new InternalServerErrorException(error?.message);
    }
  }
}
