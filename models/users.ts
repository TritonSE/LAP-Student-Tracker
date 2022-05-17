import * as t from "io-ts";

const possibleRoles = t.keyof({
  Admin: null,
  Volunteer: null,
  Student: null,
  Teacher: null,
  Parent: null,
});

export const CreateUserSchema = t.intersection([
  t.type({
    id: t.string,
    firstName: t.string,
    lastName: t.string,
    email: t.string,
    role: possibleRoles,
  }),
  t.partial({
    phoneNumber: t.union([t.string, t.null]),
    address: t.union([t.string, t.null]),
    pictureId: t.union([t.string, t.null]),
  }),
]);

export const UserSchema = t.intersection([
  t.type({
    id: t.string,
    firstName: t.string,
    lastName: t.string,
    email: t.string,
    role: possibleRoles,
    approved: t.boolean
  }),
  t.partial({
    phoneNumber: t.union([t.string, t.null]),
    address: t.union([t.string, t.null]),
    pictureId: t.union([t.string, t.null]),
  }),
]);

export const UpdateUserSchema = t.partial({
  firstName: t.string,
  lastName: t.string,
  email: t.string,
  role: possibleRoles,
  approved: t.boolean,
  phoneNumber: t.union([t.string, t.null]),
  address: t.string
});

export const UserArraySchema = t.array(UserSchema);
export type CreateUser = t.TypeOf<typeof CreateUserSchema>;
export type User = t.TypeOf<typeof UserSchema>;
export type UpdateUser = t.TypeOf<typeof UpdateUserSchema>;
export type Roles = t.TypeOf<typeof possibleRoles>;
