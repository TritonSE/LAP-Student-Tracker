import * as t from "io-ts";


export const CreateClass = t.type({
    minLevel: t.number,
    maxLevel: t.number,
    rrstring: t.string,
    startTime: t.string,
    endTime: t.string,
    language: t.string,
    eventInformationId: t.string
})

export interface CreateClass {
    minLevel: number,
    maxLevel: number,
    rrstring: string,
    startTime: string,
    endTime: string,
    language: string,
    eventInformationId: string
}