# Release Notes — Phase 3 (Media Worker)
Date: 2025-08-19

## New
- `apps/media-worker`: BullMQ-based worker for video/image processing
- Dockerfile with ffmpeg (alpine)
- Compose service `media-worker` wired to shared `redis`
- Added to workspace packages

## Next
- Wire uploads to object storage (MinIO/S3) + signed URLs
- Connect chat/vitrin to request image WebP and video HLS
