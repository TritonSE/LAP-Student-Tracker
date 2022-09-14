import * as t from "io-ts";


export const Image = t.type({
    img: t.string,
    mimeType: t.string,
    id: t.string
})

export interface Image {
    img: string,
    mimeType: string,
    id: string
}