import * as t from "io-ts";


export const ClassEvent = t.type({
    eventInformationId: t.string,
    startTime: t.string,
    endTime: t.string,
    timeZone: t.string,
    rrule: t.string,
    language: t.string,
    neverEnding: t.string,
    backgroundColor: t.string
})

export interface ClassEvent {
    eventInformationId: string,
    startTime: string,
    endTime: string,
    timeZone: string,
    rrule: string,
    language: string,
    neverEnding: string,
    backgroundColor: string
}