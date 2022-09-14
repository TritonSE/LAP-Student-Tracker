import * as t from "io-ts";


export const PossibleAttendance = t.union([
    t.literal('Unexcused'),
    t.literal('Excused'),
    t.literal('Present')
])

export type PossibleAttendance =
    (
        | 'Unexcused'
        | 'Excused'
        | 'Present'
    )