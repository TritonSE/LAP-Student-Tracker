import * as t from "io-ts";
import {UserSchema} from "./users";

const extraStudentField = t.type({
  level: t.number,
  classes: t.array(t.string),
});

export const StudentSchema = t.intersection([UserSchema, extraStudentField]);

export type Student = t.TypeOf<typeof StudentSchema>;
