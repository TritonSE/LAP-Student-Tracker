/**
 * This script sets up the calender information table with its properties of
 * user and event.
 **/

CREATE TABLE calendar_information (
    session_id text PRIMARY KEY DEFAULT gen_random_uuid(),
    event_information_id text,
    attendance_taken boolean DEFAULT false,
    start_str TIMESTAMP WITH TIME ZONE,
    end_str TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (event_information_id) REFERENCES event_information (id) ON DELETE CASCADE  
);