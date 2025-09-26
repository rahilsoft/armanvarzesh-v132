export const env = {
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379/1',
  bucketBase: process.env.MEDIA_BASE_URL || 'http://localhost:9000/arman',
  ffmpeg: process.env.FFMPEG_BIN || 'ffmpeg',
  concurrency: Number(process.env.WORKER_CONCURRENCY || 2)
};
