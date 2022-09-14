import * as t from "io-ts";


export const UpdateClass = t.partial({
    minLevel: t.number,
    maxLevel: t.number,
    rrstring: t.string,
    startTime: t.string,
    endTime: t.string,
    language: t.string
})

export interface UpdateClass {
    minLevel?: number,
    maxLevel?: number,
    rrstring?: string,
    startTime?: string,
    endTime?: string,
    language?: string
}