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
  BadRequestException,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { CreateCourseDto } from '../../common/dto/create-course.dto';
import { SetCourseFileDto } from '../../common/dto/set-course-file.dto';
import {
  COURSE_SERVICE_NAME,
  CourseServiceClient,
  SetCourseFileRequest,
  UpdateCourseRequest,
} from '../../common/interfaces/course';
import { AuthGuard } from 'common/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('course')
export class CoursesController implements OnModuleInit {
  private courseService: CourseServiceClient;

  constructor(
    @Inject(COURSE_SERVICE_NAME) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.courseService =
      this.client.getService<CourseServiceClient>(COURSE_SERVICE_NAME);
  }

  @Post('create')
  async create(@Body() createCourseDto: CreateCourseDto) {
    try {
      console.log(`Create course dto: `, createCourseDto);
      return this.courseService.createCourse(createCourseDto);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  @Get('get-all')
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    try {
      page = isNaN(+page) || +page < 1 ? 1 : +page;
      limit = isNaN(+limit) || +limit < 0 ? 0 : +limit;
      return this.courseService.findAllCourses({ page, limit });
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  @Get('get/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.courseService.findOneCourse({ id });
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  @Put('update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseRequest: UpdateCourseRequest,
  ) {
    try {
      return this.courseService.updateCourse({ id, ...updateCourseRequest });
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  @Delete('delete/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.courseService.removeCourse({ id });
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  @Post('set-course-files')
  async addFilesToCourse(@Body() setCourseFileDto: SetCourseFileDto) {
    try {
      return this.courseService.setCourseFile(setCourseFileDto);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  // @Get('get-course-files/:id')
  // async getCourseFiles(@Param('id', ParseIntPipe) id: number) {
  //   try {
  //     return this.courseService.getCourseFiles({ id });
  //   } catch (error) {
  //     throw new BadRequestException(error?.message);
  //   }
  // }

  @Delete('remove-course-files')
  async removeCourseFiles(@Body() setCourseFileDto: SetCourseFileRequest) {
    try {
      return this.courseService.removeFilesFromCourse(setCourseFileDto);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }
}
