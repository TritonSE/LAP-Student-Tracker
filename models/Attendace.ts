import * as t from "io-ts";
import { AttendanceTypes } from "./AttendanceTypes";

export const Attendace = t.type({
    sessionId: t.number,
    userId: t.number,
    attendance: AttendanceTypes,
    firstName: t.string,
    lastName: t.string
})

export interface Attendace {
    sessionId: number,
    userId: number,
    attendance: AttendanceTypes,
    firstName: string,
    lastName: string
}