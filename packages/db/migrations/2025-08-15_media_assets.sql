CREATE TABLE IF NOT EXISTS media_assets (
  id BIGSERIAL PRIMARY KEY,
  key TEXT NOT NULL,
  bucket TEXT NOT NULL,
  kind TEXT NOT NULL, -- 'image' | 'video'
  mime TEXT NOT NULL,
  size_bytes BIGINT,
  owner_user_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  variants JSONB DEFAULT '[]'::jsonb
);
CREATE INDEX IF NOT EXISTS idx_media_owner ON media_assets (owner_user_id);
