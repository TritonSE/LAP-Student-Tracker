import * as t from "io-ts";
import { AttendanceTypes } from "./AttendanceTypes";

export const SingleUserAttendance = t.type({
    sessionId: t.number,
    userId: t.number,
    attendance: AttendanceTypes,
    start: t.string
})

export interface SingleUserAttendance {
    sessionId: number,
    userId: number,
    attendance: AttendanceTypes,
    start: string
}