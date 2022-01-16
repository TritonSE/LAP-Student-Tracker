CREATE TABLE users {
    id  SERIAL PRIMARY KEY,
    email text NOT NULL UNIQUE,
    role text NOT NULL,
    first_name text DEFAULT NULL,
    last_name text DEFAULT NULL,
    phone_numer text DEFAULT NULL,
    address text DEFAULT NULL,
}