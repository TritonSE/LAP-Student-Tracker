import { client } from "../db";
import { Class, ClassSchema } from "../../models/class";
import { decode } from "io-ts-promise";
import { array, TypeOf } from "io-ts";
import { string } from "fp-ts";
import { Any } from "io-ts";
import { min } from "moment";
import * as t from "io-ts";


const ClassWithUserInformationSchema = t.type({
  name: t.string,
  eventInformationId: t.string,
  minLevel: t.number,
  maxLevel: t.number,
  rrstring: t.string,
  startTime: t.string,
  endTime: t.string,
  language: t.string,
  userId: t.string,
  firstName: t.string,
  lastName: t.string
});
const ClassWithUserInformationArraySchema = array(ClassWithUserInformationSchema)

type ClassWithUserInformation = TypeOf<typeof ClassWithUserInformationSchema>;
type ClassWithUserInformationArray = TypeOf<typeof ClassWithUserInformationArraySchema>

const ClassArraySchema = array(ClassSchema);
type classArrayType = TypeOf<typeof ClassArraySchema>;

const createClass = async (
  eventInformationId: string,
  minLevel: number,
  maxLevel: number,
  rrstring: string,
  timeStart: string,
  timeEnd: string,
  language: string,
): Promise<Class | null> => {
  const query = {
    text: "INSERT INTO classes(event_information_id, min_level, max_level, rrstring, start_time, end_time, language) VALUES($1, $2, $3, $4, $5, $6, $7)",
    values: [
      eventInformationId,
      minLevel,
      maxLevel,
      rrstring,
      timeStart,
      timeEnd,
      language,
    ],
  };

  try {
    await client.query(query);
  } catch {
    throw Error("Error on insert into database");
  }

  return getClass(eventInformationId);
};

// updates class's veriables
const updateClass = async (
  eventInformationId: string,
  minLevel?: number,
  maxLevel?: number,
  rrstring?: string,
  startTime?: string,
  endTime?: string,
  language?: string,
): Promise<Class | null> => {
  const query = {
    text:
      "UPDATE classes " +
      "SET min_level = COALESCE($2, min_level), " +
      "max_level = COALESCE($3, max_level), " +
      "rrstring = COALESCE($4, rrstring), " +
      "start_time = COALESCE($5, start_time), " +
      "end_time = COALESCE($6, end_time), " +
      "language = COALESCE($7, language) " +
      "WHERE event_information_id=$1",
    values: [
      eventInformationId,
      minLevel,
      maxLevel,
      rrstring,
      startTime,
      endTime,
      language,
    ],
  };

  try {
    await client.query(query);
  } catch (e) {
    throw Error("Error on update class");
  }

  return getClass(eventInformationId);
};

// get a class given the id
const getClass = async (id: string): Promise<Class | null> => {
  const query = {
    text:  "SELECT e.name, cl.event_information_id, cl.min_level, cl.max_level, cl.rrstring, cl.start_time, cl.end_time, cl.language, u.id as user_id, u.first_name, u.last_name " +
        "FROM (((event_information e INNER JOIN classes cl ON e.id = cl.event_information_id) " +
        "INNER JOIN commitments ON commitments.event_information_id = e.id) " +
        " INNER JOIN users u ON commitments.user_id = u.id) WHERE role = 'Teacher' AND cl.event_information_id = $1",
    values: [id]
  };
  const res = await client.query(query);
  

  if (res.rows.length == 0) {
    return null;
  }

  let classesWithUserInformation: ClassWithUserInformation[];
  try {
    classesWithUserInformation = await decode(ClassWithUserInformationArraySchema, res.rows);
  } catch {
    throw Error("Fields returned incorrectly in database");
  }
  //console.log(classesWithUserInformation);
  const mapOfClasses = new Map();
  const individualClasses = [];
  for(let i = 0; i < classesWithUserInformation.length; i++){
    if(!mapOfClasses.has(classesWithUserInformation[i].eventInformationId)){
      let currClass = {name: classesWithUserInformation[i].name,
                      eventInformationId: classesWithUserInformation[i].eventInformationId,
                      minLevel: classesWithUserInformation[i].minLevel,
                      maxLevel:classesWithUserInformation[i].maxLevel,
                      rrstring: classesWithUserInformation[i].rrstring,
                      startTime: classesWithUserInformation[i].startTime,
                      endTime: classesWithUserInformation[i].endTime,
                      language: classesWithUserInformation[i].language
                    }
      individualClasses.push(currClass);
      let curr = {userId: classesWithUserInformation[i].userId,
              firstName: classesWithUserInformation[i].firstName,
              lastName: classesWithUserInformation[i].lastName, 
            }
      let teachersArr = [curr];
      mapOfClasses.set((classesWithUserInformation[i].eventInformationId), teachersArr);
    }
    else{
      let curr = {userId: classesWithUserInformation[i].userId,
        firstName: classesWithUserInformation[i].firstName,
        lastName: classesWithUserInformation[i].lastName, 
      }
      let teachersArr = mapOfClasses.get(classesWithUserInformation[i].eventInformationId);
      teachersArr.push(curr);

      mapOfClasses.set((classesWithUserInformation[i].eventInformationId), teachersArr);
    }
  }
  for(let singleClass of individualClasses){
    let currClass : Class = {
      name : singleClass.name,
      eventInformationId: singleClass.eventInformationId,
      minLevel: singleClass.minLevel,
      maxLevel: singleClass.maxLevel,
      rrstring: singleClass.rrstring,
      startTime: singleClass.startTime,
      endTime: singleClass.endTime,
      language: singleClass.language,
      teachers: mapOfClasses.get(singleClass.eventInformationId)
    }
    return currClass;
  }
  return null;
};
const  getAllClasses = async (): Promise<Class[]> => {
  const query = {
    text:  "SELECT e.name, cl.event_information_id, cl.min_level, cl.max_level, cl.rrstring, cl.start_time, cl.end_time, cl.language, u.id as user_id, u.first_name, u.last_name " +
        "FROM (((event_information e INNER JOIN classes cl ON e.id = cl.event_information_id) " +
        "INNER JOIN commitments ON commitments.event_information_id = e.id) " +
        " INNER JOIN users u ON commitments.user_id = u.id) WHERE role = 'Teacher'",
  };
  const res = await client.query(query);
  //console.log(res);
  let classesWithUserInformation: ClassWithUserInformation[];
  try {
    classesWithUserInformation = await decode(ClassWithUserInformationArraySchema, res.rows);
  } catch {
    throw Error("Fields returned incorrectly in database");
  }
  const classesArray : Class[] = [];
  const mapOfClasses = new Map();
  const individualClasses = [];
  for(let i = 0; i < classesWithUserInformation.length; i++){
    if(!mapOfClasses.has(classesWithUserInformation[i].eventInformationId)){
      let currClass = {name: classesWithUserInformation[i].name,
                      eventInformationId: classesWithUserInformation[i].eventInformationId,
                      minLevel: classesWithUserInformation[i].minLevel,
                      maxLevel:classesWithUserInformation[i].maxLevel,
                      rrstring: classesWithUserInformation[i].rrstring,
                      startTime: classesWithUserInformation[i].startTime,
                      endTime: classesWithUserInformation[i].endTime,
                      language: classesWithUserInformation[i].language
                    }
      individualClasses.push(currClass);
      let curr = {userId: classesWithUserInformation[i].userId,
              firstName: classesWithUserInformation[i].firstName,
              lastName: classesWithUserInformation[i].lastName, 
            }
      let teachersArr = [curr];
      mapOfClasses.set((classesWithUserInformation[i].eventInformationId), teachersArr);
    }
    else{
      let curr = {userId: classesWithUserInformation[i].userId,
        firstName: classesWithUserInformation[i].firstName,
        lastName: classesWithUserInformation[i].lastName, 
      }
      let teachersArr = mapOfClasses.get(classesWithUserInformation[i].eventInformationId);
      teachersArr.push(curr);

      mapOfClasses.set((classesWithUserInformation[i].eventInformationId), teachersArr);
    }
  }
  for(let singleClass of individualClasses){
    let currClass : Class = {
      name : singleClass.name,
      eventInformationId: singleClass.eventInformationId,
      minLevel: singleClass.minLevel,
      maxLevel: singleClass.maxLevel,
      rrstring: singleClass.rrstring,
      startTime: singleClass.startTime,
      endTime: singleClass.endTime,
      language: singleClass.language,
      teachers: mapOfClasses.get(singleClass.eventInformationId)
    }
    classesArray.push(currClass);
  }





  return classesArray;
};

export { createClass, getClass, updateClass, getAllClasses };
