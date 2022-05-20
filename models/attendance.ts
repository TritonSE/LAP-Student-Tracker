import * as t from "io-ts";

const possibleAttendance = t.keyof({
    Unexcused: null,
    Excused: null,
    Present: null,
});

export const AttendanceSchema = t.type({
    sessionId: t.string,
    userId: t.string,
    firstName: t.string,
    lastName: t.string,
    attendance: t.union([possibleAttendance, t.null]),
  
});

export const SingleUserAttendanceSchema = t.type({
    sessionId: t.string,
    userId: t.string,
    attendance: t.union([possibleAttendance, t.null]),
    start: t.string,
});

export const CreateAttendanceSchema = t.type({
    userId: t.string,
    attendance: possibleAttendance,
});

export const CreateAttendanceArraySchema = t.array(CreateAttendanceSchema)

export type Attendance = t.TypeOf<typeof AttendanceSchema>;
export type SingleUserAttendance = t.TypeOf<typeof SingleUserAttendanceSchema>;
export type CreateAttendance = t.TypeOf<typeof CreateAttendanceSchema>;
export type createAttendanceArrayType = t.TypeOf<typeof CreateAttendanceArraySchema>;
