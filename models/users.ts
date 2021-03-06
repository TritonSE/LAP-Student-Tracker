import * as t from "io-ts";

export const possibleRoles = t.keyof({
  Admin: null,
  Volunteer: null,
  Student: null,
  Teacher: null,
  Parent: null,
});

export const UserSchema = t.type({
  id: t.string,
  firstName: t.string,
  lastName: t.string,
  email: t.string,
  role: possibleRoles,
  pictureId: t.string,
  approved: t.boolean,
  dateCreated: t.string,
  phoneNumber: t.union([t.string, t.null]),
  address: t.union([t.string, t.null]),
});

export const CreateUserSchema = t.type({
  id: t.string,
  firstName: t.string,
  lastName: t.string,
  email: t.string,
  role: possibleRoles,
});

export const UpdateUserSchema = t.partial({
  firstName: t.string,
  lastName: t.string,
  email: t.string,
  role: possibleRoles,
  approved: t.boolean,
  phoneNumber: t.union([t.string, t.null]),
  address: t.string,
});

export const UserArraySchema = t.array(UserSchema);
export type CreateUser = t.TypeOf<typeof CreateUserSchema>;
export type User = t.TypeOf<typeof UserSchema>;
export type UpdateUser = t.TypeOf<typeof UpdateUserSchema>;
export type Roles = t.TypeOf<typeof possibleRoles>;
