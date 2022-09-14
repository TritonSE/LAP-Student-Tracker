import * as t from "io-ts";


export const Roles = t.union([
    t.literal('Admin'),
    t.literal('Volunteer'),
    t.literal('Student'),
    t.literal('Teacher'),
    t.literal('Parent')
])

export type Roles =
    (
        | 'Admin'
        | 'Volunteer'
        | 'Student'
        | 'Teacher'
        | 'Parent'
    )