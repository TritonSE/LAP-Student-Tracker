/**
 * This script sets up the commitments table with its properties of
 * user and event.
 **/

CREATE TABLE commitments (
    user_id text,
    event_id text,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE  
);