import * as t from "io-ts";
import { Roles } from "./Roles";

export const User = t.type({
    id: t.string,
    firstName: t.string,
    lastName: t.string,
    email: t.string,
    role: Roles,
    pictureId: t.string,
    approved: t.boolean,
    dateCreated: t.string,
    phoneNumber: t.union([
        t.string,
        t.null
    ]),
    address: t.union([
        t.string,
        t.null
    ])
})

export interface User {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    role: Roles,
    pictureId: string,
    approved: boolean,
    dateCreated: string,
    phoneNumber:
    (
        | string
        | null
    ),
    address:
    (
        | string
        | null
    )
}