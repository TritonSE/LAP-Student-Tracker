

/**
 * This script sets up the classes table with its properties of
 * event, min_level, max_level, rrstring, start_time, end_time, and language
 **/
CREATE TABLE classes(
    event_information_id text UNIQUE NOT NULL,
    min_level integer NOT NULL,
    max_level integer NOT NULL,
    rrstring text NOT NULL,
    start_time text NOT NULL,
    end_time text NOT NULL,
    language text NOT NULL,
    teachers text[] NOT NULL,
    FOREIGN KEY (event_information_id) REFERENCES event_information (id) ON DELETE CASCADE
    
);
