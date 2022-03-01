import * as t from "io-ts";
export const ClassSchema = t.type({
  id: t.string,
  minLevel: t.number,
  maxLevel: t.number,
  rrstring: t.string,
  timeStart: t.string,
  timeEnd: t.string,
  language: t.string
});
export const UpdateClassSchema = t.partial({
  minLevel: t.number,
  maxLevel: t.number,
  rrstring: t.string,
  timeStart: t.string,
  timeEnd: t.string,
  language: t.string

})

export type Class = t.TypeOf<typeof ClassSchema>;
export type UpdateClass = t.TypeOf<typeof UpdateClassSchema>
