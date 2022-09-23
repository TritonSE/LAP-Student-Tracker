import * as t from "io-ts";
import { AttendanceTypes } from "./AttendanceTypes";

export const CreateAttendance = t.type({
    userId: t.string,
    attendance: AttendanceTypes
})

export interface CreateAttendance {
    userId: string,
    attendance: AttendanceTypes
}