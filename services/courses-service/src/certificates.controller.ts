
import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CoursesService } from './courses.service';

@ApiTags('certificates')
@ApiBearerAuth()
@Controller('v1')
export class CertificatesController {
  constructor(private readonly svc: CoursesService) {}

  @Get('certificates/:id/qr')
  async qr(@Param('id') id: string) {
    return this.svc.certificateQr(Number(id));
  }

  @Get('certificates/:id')
  async info(@Param('id') id: string) {
    return this.svc.certificateInfo(Number(id));
  }
}
