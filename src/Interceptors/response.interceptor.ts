// response.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  message: string;
  data: T;
  status: number;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const status = response.statusCode || HttpStatus.OK;
        return {
          message: getMessageForStatus(status),
          data: data.result || data,
          status,
        };
      }),
    );
  }
}

function getMessageForStatus(status: number): string {
  switch (status) {
    case 201:
      return 'Created successfully';
    default:
      return 'Success';
  }
}
