import * as t from "io-ts";


export const CreateModule = t.type({
    name: t.string,
    position: t.number,
    classId: t.string
})

export interface CreateModule {
    name: string,
    position: number,
    classId: string
}