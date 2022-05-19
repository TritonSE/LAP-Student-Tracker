CREATE TABLE images(
  id text PRIMARY KEY DEFAULT gen_random_uuid(),
  img bytea DEFAULT NULL,
  mime_type text DEFAULT NULL
);

ALTER TABLE users
ADD COLUMN picture_id text
REFERENCES images (id);