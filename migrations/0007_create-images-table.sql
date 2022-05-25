CREATE TABLE images(
  id text PRIMARY KEY DEFAULT gen_random_uuid(),
  img text DEFAULT NULL,
  mime_type text DEFAULT NULL
);

ALTER TABLE users
ADD COLUMN picture_id text NOT NULL
REFERENCES images (id);