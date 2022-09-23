import * as t from "io-ts";
import { Roles } from "./Roles";

export const UpdateUser = t.partial({
    id: t.string,
    firstName: t.string,
    lastName: t.string,
    email: t.string,
    role: Roles,
    pictureId: t.string,
    approved: t.boolean,
    phoneNumber: t.union([
        t.string,
        t.null
    ]),
    address: t.union([
        t.string,
        t.null
    ])
})

export interface UpdateUser {
    id?: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    role?: Roles,
    pictureId?: string,
    approved?: boolean,
    phoneNumber?:
    (
        | string
        | null
    ),
    address?:
    (
        | string
        | null
    )
}