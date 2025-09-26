import { requireEnv } from '../common/utils/nulls';
import { Body, Controller, Post } from '@nestjs/common';
import { ConfirmUploadDto } from './dto/confirm-upload.dto';

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
@Controller('media')
export class MediaUploadController {
  @Post('confirm')
  async confirm(@Body() body: ConfirmUploadDto) {
    const bucket = body.bucket || requireEnv('S3_BUCKET');
    // اینجا منطق ذخیره در دیتابیس/صف را بگذارید
    return { ok: true, bucket, key: body.key };
  }
}