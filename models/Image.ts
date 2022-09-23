import * as t from "io-ts";


export const Image = t.type({
    img: t.union([
        t.string,
        t.null
    ]),
    mimeType: t.union([
        t.string,
        t.null
    ]),
    id: t.string
})

export interface Image {
    img:
    (
        | string
        | null
    ),
    mimeType:
    (
        | string
        | null
    ),
    id: string
}