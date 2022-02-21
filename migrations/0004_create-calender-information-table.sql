/**
 * This script sets up the calender information table with its properties of
 * user and event.
 **/

CREATE TABLE calender_information (
    event_id text,
    start_str TIMESTAMP WITH TIME ZONE,
    end_str TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE  
);