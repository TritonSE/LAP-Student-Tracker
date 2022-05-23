CREATE TABLE modules (
  module_id text PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id text NOT NULL,
  name text NOT NULL,
  position integer NOT NULL,
  FOREIGN KEY (class_id) REFERENCES classes (event_information_id) ON DELETE CASCADE
);