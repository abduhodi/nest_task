import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadGatewayException,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as grpc from '@grpc/grpc-js';

@Injectable()
export class GrpcErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        console.log(error);
        if (
          error &&
          error.details &&
          error.details.startsWith('failed to connect to all addresses')
        ) {
          throw new BadGatewayException(
            'Failed to connect to the gRPC service',
          );
        } else {
          if (error.code == grpc.status.NOT_FOUND)
            throw new NotFoundException(error.message);
          else if (error.code == grpc.status.ALREADY_EXISTS)
            throw new BadRequestException(error.message);
          else if (error.code == grpc.status.INTERNAL)
            throw new InternalServerErrorException(error.message);
          else throw new BadGatewayException(error?.message);
        }
      }),
    );
  }
}
