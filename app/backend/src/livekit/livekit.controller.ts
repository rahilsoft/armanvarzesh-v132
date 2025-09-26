import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LivekitService, LiveRole } from './livekit.service';

@Controller('live')
export class LivekitController {
  constructor(private readonly live: LivekitService) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Post('token')
  @HttpCode(HttpStatus.OK)
  issueToken(@Body() body: { room: string; identity: string; role?: LiveRole; ttlSeconds?: number }) {
    const role: LiveRole = body.role ?? 'viewer';
    return this.live.issueToken({ room: body.room, identity: body.identity, role, ttlSeconds: body.ttlSeconds });
  }

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Post('room/create')
  async create(@Body() body: { room: string }) {
    return this.live.createRoom(body.room);
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  @Post('room/delete')
  async delete(@Body() body: { room: string }) {
    return this.live.deleteRoom(body.room);
  }

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Post('egress/start')
  async startEgress(@Body() body: { room: string; filepath?: string; livestreamUrl?: string }) {
    return this.live.startCompositeEgress(body.room, { filepath: body.filepath, livestreamUrl: body.livestreamUrl });
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  @Post('egress/stop')
  async stopEgress(@Body() body: { egressId: string }) {
    return this.live.stopEgress(body.egressId);
  }
}