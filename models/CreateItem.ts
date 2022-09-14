import * as t from "io-ts";


export const CreateItem = t.type({
    title: t.string,
    link: t.string
})

export interface CreateItem {
    title: string,
    link: string
}