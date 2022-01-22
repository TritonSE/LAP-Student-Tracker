import { object, array, number, string, InferType } from "yup";
import { userSchema } from "./users";

export const classSchema = object({
  id: string().required(),
  name: string().required(),
  level: number().required(),
  recurrence: array(number().required()).required(),
  timeStart: string().required(),
  timeEnd: string().required(),
  teachers: array(userSchema.required()).required(),
});

export type Class = InferType<typeof classSchema>;
