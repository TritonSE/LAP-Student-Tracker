//import { object, array, number, string, TypeOf, InferType } from "yup";
//const TypeOf = require("yup");
import { userSchema } from './users';
import { object, string, number, InferType } from 'yup';


export const classSchema = object({ 
  id: string().ensure().required(), 
  name: string().ensure().required(), 
  level: number().required(), 
  recurrence: array().ensure().required().of(number()),
  timeStart: string().ensure().required(),
  timeEnd: string().ensure().required(),
  //teachers: array().ensure().required().of(userSchema),
});

//export type Class = TypeOf<typeof classSchema>;
export type Class = InferType<typeof classSchema>;

const testClass: Class = {
  id: 'class_id',
  name: 'CSE 123',
  level: 3,
  recurrence: [1,2,3],
  timeStart: 1,
  timeEnd: 2,
  //teachers:
}
