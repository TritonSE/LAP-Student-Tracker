import * as t from "io-ts";
import {UserSchema} from "./users";

const extraStaffField = t.type({
  minLevel: t.union([t.number, t.null]),
  maxLevel: t.union([t.number, t.null]),
  language: t.union([t.string, t.null]),
});

export const StaffSchema = t.intersection([UserSchema, extraStaffField]);

export type Staff = t.TypeOf<typeof StaffSchema>;
