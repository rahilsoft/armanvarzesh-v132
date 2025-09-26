/** Formats HttpExceptions to a consistent JSON shape. */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const message = (exception.getResponse?.() as any) ?? exception.message ?? 'Unknown error';
    response.status(status).json({ ok: false, status, path: request.url, timestamp: new Date().toISOString(), error: typeof message === 'string' ? message : message?.message || message, details: typeof message === 'object' ? message : undefined });
  }
}
