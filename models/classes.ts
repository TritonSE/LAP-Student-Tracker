import * as t from "io-ts";
export const ClassSchema = t.type({
  id: t.string,
  name: t.string,
  minLevel: t.number,
  maxLevel: t.number,
  rrstring: t.string,
  timeStart: t.string,
  timeEnd: t.string,
});

export const CreateClassSchema = t.type({
  minLevel: t.number,
  maxLevel: t.number,
  rrule: t.string,
  language: t.string,
  timeStart: t.string,
  timeEnd: t.string,
});

export type Class = t.TypeOf<typeof ClassSchema>;
export type CreateClass = t.TypeOf<typeof CreateClassSchema>;
