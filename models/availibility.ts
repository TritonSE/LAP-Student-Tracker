import * as t from "io-ts";
export const AvailibilitySchema = t.type({
  mon: t.array(t.string),
  tue: t.array(t.string),
  wed: t.array(t.string),
  thu: t.array(t.string),
  fri: t.array(t.string),
  sat: t.array(t.string)
});

export type Availibility = t.TypeOf<typeof AvailibilitySchema>;
