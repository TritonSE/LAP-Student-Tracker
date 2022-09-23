import * as t from "io-ts";


export const UpdateModule = t.partial({
    name: t.string,
    position: t.number
})

export interface UpdateModule {
    name?: string,
    position?: number
}