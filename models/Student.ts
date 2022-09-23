import * as t from "io-ts";
import { Roles } from "./Roles";

export const Student = t.type({
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
    ]),
    level: t.number,
    classes: t.array(t.string)
})

export interface Student {
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
    ),
    level: number,
    classes: Array<string>
}