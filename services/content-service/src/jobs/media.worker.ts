
import { Queue, Worker, JobsOptions } from 'bullmq';
import IORedis from 'ioredis';
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const prisma = new PrismaClient();

const connection = process.env.REDIS_URL ? new IORedis(process.env.REDIS_URL) : null;
const queueName = 'media-processing';
const queue = connection ? new Queue(queueName, { connection: { url: process.env.BULLMQ_CONNECTION || process.env.REDIS_URL }, defaultJobOptions: { attempts: parseInt(process.env.BULLMQ_DEFAULT_ATTEMPTS||'5'), backoff: { type: 'exponential', delay: parseInt(process.env.BULLMQ_BACKOFF_MS||'5000') }, removeOnComplete: parseInt(process.env.BULLMQ_REMOVE_ON_COMPLETE||'1000'), removeOnFail: parseInt(process.env.BULLMQ_REMOVE_ON_FAIL||'5000') },  connection }) : null;

const s3 = (process.env.S3_BUCKET && process.env.AWS_REGION) ? new S3Client({ region: process.env.AWS_REGION }) : null as any;

export async function enqueueMediaProcessing(exerciseId: string, opts: JobsOptions = {}){
  if (queue){
    await queue.add('process-exercise', { exerciseId }, { removeOnComplete: true, removeOnFail: 20, attempts: 2, ...opts });
  } else {
    // Fallback: run inline
    await processExerciseMediaHandler(exerciseId);
  }
}

export function startMediaWorker(){
  if (!queue || !connection) return null;
  const worker = new Worker(queueName, async (job, { connection: { url: process.env.BULLMQ_CONNECTION || process.env.REDIS_URL }, concurrency: parseInt(process.env.WORKER_CONCURRENCY||'4') })=>{
    if (job.name === 'process-exercise'){
      const { exerciseId } = job.data;
      await processExerciseMediaHandler(exerciseId);
    }
  }, { connection });
  return worker;
}

export async function processExerciseMediaHandler(id: string){
  const ex = await prisma.exerciseVideo.findUnique({ where: { id } });
  if (!ex) return;
  const uploads = path.join(process.cwd(), 'uploads'); if (!fs.existsSync(uploads)) fs.mkdirSync(uploads, { recursive: true });
  const tmpVideo = path.join(uploads, `tmp_${id}.mp4`);
  try{
    // download video
    const r = await fetch(ex.videoUrl); const buf = await r.buffer(); fs.writeFileSync(tmpVideo, buf);
    // probe duration
    let duration = 0;
    try{
      const out = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${tmpVideo}`).toString().trim();
      duration = Math.floor(parseFloat(out)||0);
    }catch(e){}
    // thumbnail at 2s or 30%
    const sec = Math.max(2, Math.floor(duration * 0.3));
    const thumb = path.join(uploads, `thumb_${id}.jpg`);
    try{
      execSync(`ffmpeg -y -ss ${sec} -i ${tmpVideo} -frames:v 1 -q:v 3 ${thumb}`);
    }catch(e){}
    let thumbnailUrl: string | null = null;
    if (fs.existsSync(thumb)){
      if (s3 && process.env.S3_BUCKET){
        const key = `thumbs/${id}.jpg`;
        const cmd = new PutObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: key, Body: fs.readFileSync(thumb), ContentType: 'image/jpeg' });
        await s3.send(cmd);
        thumbnailUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      } else {
        thumbnailUrl = `/uploads/${path.basename(thumb)}`;
      }
    }
    await prisma.exerciseVideo.update({ where:{ id }, data: { durationSec: duration||null, thumbnailUrl } });
  } finally {
    try{ fs.unlinkSync(tmpVideo); }catch(e){}
  }
}
