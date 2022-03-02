import * as t from "io-ts";

export const CreateClassEventSchema = t.type({
  name: t.string,
  startTime: t.string,
  endTime: t.string,
  timeZone: t.string,
  rrule: t.string,
  language: t.string,
  neverEnding: t.boolean,
  backgroundColor: t.string,
  teachers: t.array(t.string),
});

export const ClassEventSchema = t.type({
  eventInformationId: t.string,
  startTime: t.string,
  endTime: t.string,
  timeZone: t.string,
  rrule: t.string,
  language: t.string,
  neverEnding: t.boolean,
  backgroundColor: t.string,
});

export const CalendarEventSchema = t.type({
  id: t.string,
  title: t.string,
  backgroundColor: t.string,
  startStr: t.string,
  endStr: t.string,
});

export type CreateClassEvent = t.TypeOf<typeof CreateClassEventSchema>;
export type ClassEvent = t.TypeOf<typeof ClassEventSchema>;
export type CalendarEvent = t.TypeOf<typeof CalendarEventSchema>;