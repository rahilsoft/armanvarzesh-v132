# Release Notes — Phase 8 (Media Worker S3 Upload)
- media-worker now uploads processed files to MinIO/S3 using AWS SDK v3
- Env supported: S3_ENDPOINT, S3_REGION, S3_BUCKET, S3_ACCESS_KEY, S3_SECRET_KEY (inject credentials at runtime via secrets)
- Dockerfile expects S3 credentials to be provided at runtime; no defaults baked into the image
