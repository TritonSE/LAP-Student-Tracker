import * as t from "io-ts";


export const UpdateImage = t.type({
    img: t.string,
    mimeType: t.string
})

export interface UpdateImage {
    img: string,
    mimeType: string
}