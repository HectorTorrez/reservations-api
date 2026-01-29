import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let messages: string[] = ['Internal server error'];

    switch (exception.code) {
      case 'P2002':
        status = HttpStatus.CONFLICT;
        messages = ['Resource already exists'];
        break;

      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        messages = ['Resource not found'];
        break;
    }

    response.status(status).json({
      statusCode: status,
      error: HttpStatus[status],
      messages,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
