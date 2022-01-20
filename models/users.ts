import { object, string, TypeOf } from "yup";
export const requestUserSchema = object({
    id: string().ensure().required(),
    first_name: string().ensure().required(),
    last_name: string().ensure().required(),
    email: string().ensure().required(),
    role: string().ensure().required().oneOf(["Admin", "Volunteer", "Teacher", "Student", "Parent"]),
    phone_number: string().optional(), 
    address: string().ensure().required(),   
});

export const userSchema= object({
    id: string().ensure().required(),
    first_name: string().ensure().required(),
    last_name: string().ensure().required(),
    email: string().ensure().required(),
    role: string().ensure().required().oneOf(["Admin", "Volunteer", "Teacher", "Student", "Parent"]),
    phone_number: string().optional(), 
    address: string().ensure().required(),   
})

export const updateUserSchema = object({
    id: string().required(), //not sure about this
    first_name: string().optional(),
    last_name: string().optional(),
    email: string().optional(),
    role: string().optional().oneOf(["Admin", "Volunteer", "Teacher", "Student", "Parent"]),
    phone_number: string().optional(),
    address: string().optional(),

})

export type RequestUser = TypeOf<typeof requestUserSchema>;
export type User = TypeOf<typeof userSchema>;