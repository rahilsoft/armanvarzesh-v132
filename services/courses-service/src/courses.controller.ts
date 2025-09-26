
import { Controller, Get, Param, Post, Req, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { CoursesService } from './courses.service';

const licenseDto = z.object({ deviceId: z.string().min(4) });

@ApiTags('courses')
@ApiBearerAuth()
@Controller('v1')
export class CoursesController {
  constructor(private readonly svc: CoursesService) {}

  @Get('courses/:id/manifest')
  async manifest(@Param('id') id: string) {
    return this.svc.manifest(Number(id));
  }

  @Post('courses/:id/license')
  async license(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    const v = licenseDto.parse(body);
    const userId = Number(req.user?.id || req.headers['x-user-id'] || req.query.userId);
    return this.svc.license(Number(id), userId, v.deviceId);
  }
}
