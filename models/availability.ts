import * as t from "io-ts";
<<<<<<< HEAD:models/availability.ts
export const AvailabilitySchema = t.type({
=======

export const AvailibilitySchema = t.type({
>>>>>>> f0359eba28b3ec46a7b56b30d10b4437dcb08262:models/availibility.ts
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
