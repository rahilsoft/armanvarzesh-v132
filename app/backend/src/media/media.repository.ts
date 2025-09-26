import { Injectable } from '@nestjs/common';
import { Prisma, } from '@prisma/client';
import { SafePrismaService } from '../common/database/prisma.safe';
import { BaseRepository } from '../common/repository/base.repository';

type MediaKind = 'image' | 'video';

export interface InsertAssetParams { key: string; bucket: string; kind: MediaKind; mime: string; size?: number | null; ownerUserId?: string | null; }

@Injectable()
export class MediaRepository extends BaseRepository {
  constructor(private readonly prisma: SafePrismaService) { super(); }

  async insertAsset(params: InsertAssetParams): Promise<void> {
    const sizeValue = typeof params.size === 'number' ? params.size : null;
    const ownerValue = params.ownerUserId ?? null;
    await this.safeCall(async () => {
      await this.prisma.exec(Prisma.sql`
        INSERT INTO media_assets (key, bucket, kind, mime, size_bytes, owner_user_id)
        VALUES (${params.key}, ${params.bucket}, ${params.kind}, ${params.mime}, ${sizeValue}, ${ownerValue})
      `);
      return;
    }, 'media.insertAsset');
  }
}
