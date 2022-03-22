CREATE TABLE availibilities(
  user_id text UNIQUE NOT NULL, 
  mon text[], 
  tue text[], 
  wed text[], 
  thu text[], 
  fri text[], 
  sat text[] ,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);