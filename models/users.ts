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

export const updateUserSchema = object({
  first_name: string().optional(),
  last_name: string().optional(),
  email: string().optional(),
  role: string().optional().oneOf(["Admin", "Volunteer", "Teacher", "Student", "Parent"]),
  phone_number: string().optional(),
  address: string().optional(),
});

export type User = InferType<typeof userSchema>;
export type UpdateUser = InferType<typeof updateUserSchema>;
