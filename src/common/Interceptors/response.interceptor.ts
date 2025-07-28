// // response.interceptor.ts
// import {
//   CallHandler,
//   ConflictException,
//   ExecutionContext,
//   HttpStatus,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
//
// export interface Response<T> {
//   message: string;
//   data: T;
//   status: number;
// }
//
// @Injectable()
// export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
//   intercept(
//     context: ExecutionContext,
//     next: CallHandler,
//   ): Observable<Response<T>> {
//     return next.handle().pipe(
//       map((data) => {
//         // if (data?.split(' ')[0] === 'Duplicate') {
//         //   throw new ConflictException(
//         //     'Duplicate entry: this record already exists.',
//         //   );
//         // }
//
//         const ctx = context.switchToHttp();
//         const response = ctx.getResponse();
//         const status = response.statusCode || HttpStatus.OK;
//         return {
//           message: getMessageForStatus(status),
//           data: data.result || data,
//           status,
//         };
//       }),
//     );
//   }
// }
//
// function getMessageForStatus(status: number): string {
//   switch (status) {
//     case status:
//       return 'Created successfully';
//     default:
//       return 'Success';
//   }
// }

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  statusCode: number;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: 'Request successful',
        data: data,
        timestamp: new Date().toISOString(),
        statusCode: response.statusCode,
        path: request.url,
        method: request.method,
      })),
    );
  }
}
