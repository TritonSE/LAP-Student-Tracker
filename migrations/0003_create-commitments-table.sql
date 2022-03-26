/**
 * This script sets up the commitments table with its properties of
 * user and event.
 **/

CREATE TABLE commitments (
    user_id text,
    event_information_id text,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (event_information_id) REFERENCES event_information (id) ON DELETE CASCADE  
);