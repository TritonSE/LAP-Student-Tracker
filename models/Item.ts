import * as t from "io-ts";


export const Item = t.type({
    title: t.string,
    link: t.string,
    moduleId: t.string,
    itemId: t.string
})

export interface Item {
    title: string,
    link: string,
    moduleId: string,
    itemId: string
}