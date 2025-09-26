import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const code = exception.code;
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error';

    if (code === 'P2002') { status = HttpStatus.CONFLICT; message = 'Unique constraint violation'; }
    if (code === 'P2025') { status = HttpStatus.NOT_FOUND; message = 'Record not found'; }

    res.status(status).json({ ok: false, error: message, code });
  }
}
