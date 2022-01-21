CREATE TABLE users (
    id  text NOT NULL UNIQUE,
    email text NOT NULL UNIQUE,
    role text NOT NULL,
    first_name text DEFAULT NULL,
    last_name text DEFAULT NULL,
    phone_number text DEFAULT NULL,
    address text DEFAULT NULL
);

/**
This script sets up the user table with the relevant properties
**/