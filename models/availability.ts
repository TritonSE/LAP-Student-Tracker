import * as t from "io-ts";
export const AvailabilitySchema = t.type({
  mon: t.union([t.array(t.array(t.string)), t.null]),
  tue: t.union([t.array(t.array(t.string)), t.null]),
  wed: t.union([t.array(t.array(t.string)), t.null]),
  thu: t.union([t.array(t.array(t.string)), t.null]),
  fri: t.union([t.array(t.array(t.string)), t.null]),
  sat: t.union([t.array(t.array(t.string)), t.null]),
  timeZone: t.string,
});

export type Availability = t.TypeOf<typeof AvailabilitySchema>;
export type ValidDays = "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
