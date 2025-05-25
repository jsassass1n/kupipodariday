import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Error');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err: Error) => {
        const req = context.switchToHttp().getRequest<Request>();
        this.logger.error(
          `Error on ${req.method} ${req.url}: ${err.message}`,
          err.stack,
        );
        return throwError(() => err);
      }),
    );
  }
}
