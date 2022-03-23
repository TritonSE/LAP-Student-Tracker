import * as t from "io-ts";
export const AvailibilitySchema = t.type({
  mon: t.union([t.array(t.array(t.string)), t.null]),
  tue: t.union([t.array(t.array(t.string)), t.null]),
  wed: t.union([t.array(t.array(t.string)), t.null]),
  thu: t.union([t.array(t.array(t.string)), t.null]),
  fri: t.union([t.array(t.array(t.string)), t.null]),
  sat: t.union([t.array(t.array(t.string)), t.null]),
  timeZone: t.string
});


export type Availibility = t.TypeOf<typeof AvailibilitySchema>;