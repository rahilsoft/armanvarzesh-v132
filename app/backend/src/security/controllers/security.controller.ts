
import { Controller, Get } from '@nestjs/common';
import { SecurityService } from '../security.service';

@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get('audit')
  getAuditLog() {
    return this.securityService.auditLog;
  }
}