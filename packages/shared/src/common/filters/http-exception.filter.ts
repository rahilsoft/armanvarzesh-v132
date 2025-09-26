import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const httpEx = exception instanceof HttpException ? (exception as HttpException) : null;
    const status = httpEx ? httpEx.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const resp = httpEx ? (httpEx.getResponse() as any) : { message: 'Internal server error' };
    const message = typeof resp === 'object' && resp?.message ? resp.message : resp;

    Logger.error(
      typeof message === 'string' ? message : JSON.stringify(message),
      undefined,
      'HttpExceptionFilter',
    );

    response.status(status).json({
      statusCode: status,
      path: request?.url,
      timestamp: new Date().toISOString(),
      ...(typeof resp === 'object' ? resp : { message }),
    });
  }
}

// Backwards compatible alias:
export const AllExceptionsFilter = HttpExceptionFilter;
