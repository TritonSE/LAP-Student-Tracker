import * as t from "io-ts";
import { AttendanceTypes } from "./AttendanceTypes";

export const SingleUserAttendance = t.type({
    sessionId: t.string,
    userId: t.string,
    attendance: AttendanceTypes,
    start: t.string,
    end: t.string
})

export interface SingleUserAttendance {
    sessionId: string,
    userId: string,
    attendance: AttendanceTypes,
    start: string,
    end: string
}