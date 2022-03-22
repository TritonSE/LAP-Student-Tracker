import * as t from "io-ts";
import { UpdateClassSchema } from "./class";
export const AvailibilitySchema = t.type({
  mon: t.union([t.array(t.array(t.string)), t.null]),
  tue: t.union([t.array(t.array(t.string)), t.null]),
  wed: t.union([t.array(t.array(t.string)), t.null]),
  thu: t.union([t.array(t.array(t.string)), t.null]),
  fri: t.union([t.array(t.array(t.string)), t.null]),
  sat: t.union([t.array(t.array(t.string)), t.null])
});


export type Availibility = t.TypeOf<typeof AvailibilitySchema>;