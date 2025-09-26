import { promises as fs } from 'fs';
import { join } from 'path';
const BASE = process.env.RECORDINGS_DIR || '/mnt/data/recordings';
export async function saveBase64Audio(b64: string, fileName?: string): Promise<string> {
  const buf = Buffer.from(b64, 'base64');
  const name = fileName || `audio_${Date.now()}.webm`;
  await fs.mkdir(BASE, { recursive: true });
  await fs.writeFile(join(BASE, name), buf);
  const baseUrl = process.env.RECORDINGS_BASE_URL || 'http://localhost:9000/recordings';
  return `${baseUrl}/${name}`;
}
export async function saveRecordingPlaceholder(sessionId: string): Promise<string> {
  await fs.mkdir(BASE, { recursive: true });
  const name = `recording_${sessionId}.mp4`;
  await fs.writeFile(join(BASE, name), Buffer.from(''));
  const baseUrl = process.env.RECORDINGS_BASE_URL || 'http://localhost:9000/recordings';
  return `${baseUrl}/${name}`;
}
