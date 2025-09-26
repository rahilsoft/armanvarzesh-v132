import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

type ErrorPayload = { ok: false; error: string; code?: string | number; details?: any };

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let payload: ErrorPayload = { ok: false, error: 'Internal error' };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;
      payload = {
        ok: false,
        error: typeof res === 'string' ? res : res?.message || exception.message,
        code: (res && res.code) || status,
        details: typeof res === 'object' ? res : undefined,
      };
    } else if (exception && typeof exception === 'object' && 'message' in (exception as any)) {
      payload = { ok: false, error: (exception as any).message || 'Error' };
    }

    this.logger.error(`${request.method} ${request.url} -> ${status} ${payload.error}`);
    response.status(status).json(payload);
  }
}
