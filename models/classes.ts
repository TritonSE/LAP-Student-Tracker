import * as t from "io-ts";
export const ClassSchema = t.type({
  id: t.string,
  name: t.string,
  minLevel: t.number,
  maxLevel: t.number,
  rrstring: t.string,
  timeStart: t.string,
  timeEnd: t.string
  /*
  recurrence: t.array(t.number),
  teachers: t.array(UserSchema),
  */
});
export const UpdateClassSchema = t.partial({
  name: t.string,
  minLevel: t.number,
  maxLevel: t.number,
  rrstring: t.string,
  timeStart: t.string,
  timeEnd: t.string

})

export type Class = t.TypeOf<typeof ClassSchema>;
export type UpdateClass = t.TypeOf<typeof UpdateClassSchema>
