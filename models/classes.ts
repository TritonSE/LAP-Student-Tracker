import * as t from "io-ts";
import { UserSchema } from "./users";
export const ClassSchema = t.type({
  id: t.string,
  name: t.string,
  minLevel: t.number,
  maxLevel: t.number,
  recurrence: t.array(t.number),
  timeStart: t.string,
  timeEnd: t.string,
  teachers: t.array(UserSchema),
});

export type Class = t.TypeOf<typeof ClassSchema>;
