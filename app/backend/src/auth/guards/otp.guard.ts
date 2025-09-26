
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class OtpGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    // Add logic to check OTP session (e.g. req.session.otp)
    return !!req.session?.otpValid;
  }
}
