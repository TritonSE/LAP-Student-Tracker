import * as t from "io-ts";


export const AttendanceTypes = t.union([
    t.union([
        t.literal('Unexcused'),
        t.literal('Excused'),
        t.literal('Present')
    ]),
    t.null
])

export type AttendanceTypes =
    (
        |
        (
            | 'Unexcused'
            | 'Excused'
            | 'Present'
        )
        | null
    )