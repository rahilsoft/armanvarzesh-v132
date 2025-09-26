import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly svc: ChatService){}

  @Get('history/:threadId')
  history(@Param('threadId') id:string, @Query('limit') limit?:string, @Query('cursor') cursor?:string){
    return this.svc.history(id, limit? Number(limit):50, cursor);
  }

  @Post('attachments/presign')
  presign(@Body() body:{ kind:string, sizeBytes:number, mime:string }){
    return this.svc.presignUpload(body.kind, body.sizeBytes, body.mime);
  }

  @Post('webhooks/scan-result')
  scan(@Body() body:{ attachmentId:string, safe:boolean }){
    return this.svc.onScanResult(body.attachmentId, !!body.safe);
  }
}
