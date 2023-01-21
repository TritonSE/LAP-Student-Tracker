/**
 * This script sets up the parents table with its properties of
 * parent id and student id.
 **/

CREATE TABLE parents (
    parent_id text,
    student_id text,
    FOREIGN KEY (parent_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE
);