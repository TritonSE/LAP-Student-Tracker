import * as t from "io-ts";


export const CreateClassEvent = t.intersection([
    t.type({
        eventInformationId: t.string,
        startTime: t.string,
        endTime: t.string,
        timeZone: t.string,
        rrule: t.string,
        language: t.string,
        neverEnding: t.string,
        backgroundColor: t.string,
        teachers: t.array(t.string),
        checkAvailabilities: t.boolean
    }),
    t.partial({
        name: t.string
    })
])

export interface CreateClassEvent {
    eventInformationId: string,
    startTime: string,
    endTime: string,
    timeZone: string,
    rrule: string,
    language: string,
    neverEnding: string,
    backgroundColor: string,
    name?: string,
    teachers: Array<string>,
    checkAvailabilities: boolean
}