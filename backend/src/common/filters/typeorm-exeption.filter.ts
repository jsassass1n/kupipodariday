/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const err = exception as any;

    let errStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Что-то пошло не так';

    if (err?.code === '23505') {
      errStatus = HttpStatus.CONFLICT;
      message = 'Такая сущность уже существует';
    } else if (err.code === '23503') {
      errStatus = HttpStatus.BAD_REQUEST;
    }

    response.status(errStatus).json({
      statusCode: errStatus,
      message,
    });
  }
}
