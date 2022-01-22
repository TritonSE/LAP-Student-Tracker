import { object, string, number, array, InferType } from "yup";

export const requestUserSchema = object({
  id: string().required(),
  firstName: string().required(),
  lastName: string().required(),
  email: string().required(),
  role: string().required().oneOf(["Admin", "Volunteer", "Teacher", "Student", "Parent"]),
  phone_number: string().optional(),
  address: string().required(),
});

export const userSchema = object({
  id: string().required(),
  firstName: string().required(),
  lastName: string().required(),
  email: string().required(),
  role: string().required().oneOf(["Admin", "Volunteer", "Teacher", "Student", "Parent"]),
  phone_number: string().optional(),
  address: string().required(),
});

export type RequestUser = InferType<typeof requestUserSchema>;
export type User = InferType<typeof userSchema>;

const studentSchema = userSchema.concat(
  object({
    level: number().required(),
    classes: array(string().required()).required(),
  })
);

export type Student = InferType<typeof studentSchema>;
