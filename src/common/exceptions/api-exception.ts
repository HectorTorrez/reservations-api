import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiException extends HttpException {
  constructor(
    messages: string | string[],
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    error: string = HttpStatus[status],
  ) {
    super(
      {
        statusCode: status,
        error: error,
        messages: Array.isArray(messages) ? messages : [messages],
        timestamp: new Date().toISOString(),
      },
      status,
    );
  }
}
