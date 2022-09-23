import * as t from "io-ts";


export const Module = t.type({
    moduleId: t.string,
    name: t.string,
    position: t.number,
    classId: t.string
})

export interface Module {
    moduleId: string,
    name: string,
    position: number,
    classId: string
}