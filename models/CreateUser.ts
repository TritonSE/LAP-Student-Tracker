import * as t from "io-ts";
import { Roles } from "./Roles";

export const CreateUser = t.type({
    id: t.string,
    firstName: t.string,
    lastName: t.string,
    email: t.string,
    role: Roles
})

export interface CreateUser {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    role: Roles
}