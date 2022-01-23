import { object, string, InferType } from "yup";

export const userSchema = object({
  id: string().required(),
  first_name: string().required(),
  last_name: string().required(),
  email: string().required(),
  role: string().required().oneOf(["Admin", "Volunteer", "Teacher", "Student", "Parent"]),
  phone_number: string().optional(),
  address: string().required(),
});

export type User = InferType<typeof userSchema>;
