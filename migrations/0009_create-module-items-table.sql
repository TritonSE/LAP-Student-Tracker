CREATE TABLE module_items (
  item_id text PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id text NOT NULL,
  title text NOT NULL,
  link text NOT NULL,
  FOREIGN KEY (module_id) REFERENCES modules (module_id) ON DELETE CASCADE
);