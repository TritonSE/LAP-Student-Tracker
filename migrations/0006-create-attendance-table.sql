/**
 * This script sets up the attendance table with its properties of the
 * calendar, user and class.
 **/

 CREATE TABLE attendance (
    session_id text,
    attendance text,
    class_id text, 
    user_id text,
    FOREIGN KEY (session_id) REFERENCES calendar_information (session_id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES event_information (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    PRIMARY KEY (session_id, user_id)
 );