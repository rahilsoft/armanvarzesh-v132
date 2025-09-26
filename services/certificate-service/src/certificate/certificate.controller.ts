import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CertificateService } from './certificate.service';

@Controller('cert')
export class CertificateController {
  constructor(private readonly svc: CertificateService) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Post('issue')
  @Roles('admin')
  @UseGuards(RolesGuard)
  async issue(@Body() body: any) {
    return this.svc.issueCertificate(body);
  }

/** @deprecated AUTO-MARKED (Stage19): GQL op 't' is unused per Stage 07 census. */
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get('verify')
  verify(@Query('t') t: string) {
    return this.svc.verify(t);
  }
}