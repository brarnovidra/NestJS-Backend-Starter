import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Kalau request GraphQL → jangan bungkus response
    if (context.getType<string>() === 'graphql') {
      return next.handle();
    }

    // Kalau request REST (HTTP) → bungkus response global format
    return next.handle().pipe(
      map((data) => {
        const httpCtx = context.switchToHttp();
        const response = httpCtx.getResponse();
        const statusCode = response?.statusCode ?? 200;

        return {
          statusCode,
          message: data?.message ?? 'Success',
          data: data?.data ?? data,
        };
      }),
    );
  }
}
