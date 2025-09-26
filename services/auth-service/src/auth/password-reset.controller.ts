import { Body, Controller, Post } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';

class RequestDto { email: string; }
class ConfirmDto { email: string; token: string; newPassword: string; }

@Controller('auth/password')
export class PasswordResetController {
  constructor(private readonly svc: PasswordResetService) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Post('request')
  async request(@Body() dto: RequestDto) {
    return this.svc.request(dto.email);
  }

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Post('confirm')
  async confirm(@Body() dto: ConfirmDto) {
    return this.svc.confirm(dto.email, dto.token, dto.newPassword);
  }
}