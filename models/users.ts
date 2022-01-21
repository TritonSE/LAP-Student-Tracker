import { object, string, TypeOf } from "yup";

export const userSchema= object({
    id: string().ensure().required(),
    first_name: string().ensure().required(),
    last_name: string().ensure().required(),
    email: string().ensure().required(),
    role: string().ensure().required().oneOf(["Admin", "Volunteer", "Teacher", "Student", "Parent"]),
    phone_number: string().optional(), 
    address: string().ensure().required(),   
})

export type User = TypeOf<typeof userSchema>;