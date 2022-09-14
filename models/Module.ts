import * as t from "io-ts";


export const Module = t.type({
    moduleId: t.string
})

export interface Module {
    moduleId: string
}