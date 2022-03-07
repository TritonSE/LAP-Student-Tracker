/**
 * This script sets up the events table with its properties of
 * id, title, background_color, start_str, end_str, recurring, start_recur, end_recur, start_time, end_time, and rrstring.
 **/

CREATE TABLE event_information (
    id text PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    background_color text NOT NULL,
    type text NOT NULL,
    never_ending boolean NOT NULL
);