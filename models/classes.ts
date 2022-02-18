import * as t from "io-ts";
import { UserSchema } from "./users";
export const ClassSchema = t.type({
  id: t.string,
  name: t.string,
  minLevel: t.number,
  maxLevel: t.number,
  rrstring: t.string,
  timeStart: t.string,
  timeEnd: t.string,
  /*
  recurrence: t.array(t.number),
  teachers: t.array(UserSchema),
  */
});

export type Class = t.TypeOf<typeof ClassSchema>;
