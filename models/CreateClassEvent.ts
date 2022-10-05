import * as t from "io-ts";


export const CreateClassEvent = t.type({
    startTime: t.string,
    endTime: t.string,
    timeZone: t.string,
    rrule: t.string,
    language: t.string,
    neverEnding: t.boolean,
    backgroundColor: t.string,
    name: t.string,
    teachers: t.array(t.string),
    students: t.array(t.string),
    checkAvailabilities: t.boolean
})

export interface CreateClassEvent {
    startTime: string,
    endTime: string,
    timeZone: string,
    rrule: string,
    language: string,
    neverEnding: boolean,
    backgroundColor: string,
    name: string,
    teachers: Array<string>,
    students: Array<string>,
    checkAvailabilities: boolean
}