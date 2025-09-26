
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

export type Provider = 'local'|'s3'|'gcs';
export interface SaveResult { url: string; path?: string; }

export async function saveBuffer(buf: Buffer, key: string, provider: Provider = (process.env.MEDIA_PROVIDER as Provider)||'local'): Promise<SaveResult> {
  if (provider === 'local') {
    const dir = process.env.RECORDINGS_DIR || './_recordings';
    const base = (process.env.RECORDINGS_BASE_URL || 'http://localhost:9000/recordings').replace(/\/$/, '');
    const file = `${dir}/${key}`;
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, buf);
    return { url: `${base}/${key}`, path: file };
  }
  // For brevity, s3/gcs placeholders:
  if (provider === 's3') {
    return { url: `s3://${process.env.S3_BUCKET}/${key}` };
  }
  return { url: `gs://${process.env.GCS_BUCKET}/${key}` };
}
