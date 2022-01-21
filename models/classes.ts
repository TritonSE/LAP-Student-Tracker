import { object, array, number, string, TypeOf } from "yup";
import { userSchema } from "./users";

export const classSchema = object({
  id: string().ensure().required(),
  name: string().ensure().required(),
  level: number().required(),
  recurrence: array().ensure().required().of(number()),
  timeStart: string().ensure().required(),
  timeEnd: string().ensure().required(),
  teachers: array().ensure().required().of(userSchema),
});

export type Class = TypeOf<typeof classSchema>;
