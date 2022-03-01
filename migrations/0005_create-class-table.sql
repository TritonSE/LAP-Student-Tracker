


CREATE TABLE classes(
    event_information_id text NOT NULL,
    min_level integer NOT NULL,
    max_level integer NOT NULL,
    rrstring text NOT NULL,
    start_time TIME with TIME ZONE NOT NULL,
    end_time TIME with TIME ZONE NOT NULL,
    language text NOT NULL,
    FOREIGN KEY (event_information_id) REFERENCES event_information (id) ON DELETE CASCADE
    
);