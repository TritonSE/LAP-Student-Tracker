/**
 * This script sets up the announcements table with its properties
 * of event, title, content, and id
 */
CREATE TABLE announcements (
    event_information_id text,
    title text NOT NULL,
    content text NOT NULL,
    id text PRIMARY KEY DEFAULT gen_random_uuid(),
    FOREIGN KEY (event_information_id) REFERENCES event_information (id) ON DELETE CASCADE    
);