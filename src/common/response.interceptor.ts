import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((data) => {
        const { message = '', ...rest } = data || {};
        return {
          data: Array.isArray(data) ? data : rest || null,
          code: res.statusCode,
          success: true,
          message,
        };
      }),
    );
  }
}
