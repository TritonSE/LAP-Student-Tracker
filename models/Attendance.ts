import * as t from "io-ts";
import { AttendanceTypes } from "./AttendanceTypes";

export const Attendance = t.type({
    sessionId: t.string,
    userId: t.string,
    attendance: AttendanceTypes,
    firstName: t.string,
    lastName: t.string
})

export interface Attendance {
    sessionId: string,
    userId: string,
    attendance: AttendanceTypes,
    firstName: string,
    lastName: string
}