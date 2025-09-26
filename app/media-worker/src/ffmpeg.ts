import { execa } from 'execa';
import { env } from './env';

export async function runFFmpeg(args: string[]) {
  const { stdout, stderr } = await execa(env.ffmpeg, args);
  return { stdout, stderr };
}

export function hls720(input: string, output: string) {
  return ['-y','-i', input, '-vf','scale=-2:720','-c:v','h264','-b:v','2800k','-c:a','aac','-b:a','128k','-f','hls', output];
}

export function mp4720(input: string, output: string) {
  return ['-y','-i', input, '-vf','scale=-2:720','-c:v','libx264','-preset','medium','-crf','22','-c:a','aac','-b:a','128k', output];
}

export function imgWebp(input: string, output: string, width=1280) {
  return ['-y','-i', input, '-vf', `scale=${width}:-2`, '-c:v','libwebp','-qscale','75', output];
}

export function imgAvif(input: string, output: string, width=1280) {
  return ['-y','-i', input, '-vf', `scale=${width}:-2`, '-c:v','libaom-av1','-crf','30','-b:v','0', output];
}
