import * as t from "io-ts";


export const Class = t.type({
    minLevel: t.number,
    maxLevel: t.number,
    rrstring: t.string,
    startTime: t.string,
    endTime: t.string,
    language: t.string,
    eventInformationId: t.string,
    name: t.string
})

export interface Class {
    minLevel: number,
    maxLevel: number,
    rrstring: string,
    startTime: string,
    endTime: string,
    language: string,
    eventInformationId: string,
    name: string
}