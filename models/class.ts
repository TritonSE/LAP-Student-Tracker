import * as t from "io-ts";
export const ClassSchema = t.type({
  name: t.string,
  eventInformationId: t.string,
  minLevel: t.number,
  maxLevel: t.number,
  rrstring: t.string,
  startTime: t.string,
  endTime: t.string,
  language: t.string,
  teachers: t.array(t.string)
});

export const CreateClassSchema = t.type({
  eventInformationId: t.string,
  minLevel: t.number,
  maxLevel: t.number,
  rrstring: t.string,
  startTime: t.string,
  endTime: t.string,
  language: t.string,
});

export const UpdateClassSchema = t.partial({
  minLevel: t.number,
  maxLevel: t.number,
  rrstring: t.string,
  startTime: t.string,
  endTime: t.string,
  language: t.string,
});


export type Class = t.TypeOf<typeof ClassSchema>;
export type CreateClass = t.TypeOf<typeof CreateClassSchema>;
export type UpdateClass = t.TypeOf<typeof UpdateClassSchema>;

