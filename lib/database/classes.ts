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
    text: "SELECT e.name, c.event_information_id, c.min_level, c.max_level, c.rrstring, c.start_time, c.end_time, c.language FROM event_information e, classes c WHERE e.id = c.event_information_id AND e.type = 'Class' AND c.event_information_id = $1",
    values: [id],
  };

  const res = await client.query(query);
  if (res.rows.length == 0) {
    return null;
  }

  let oneClass: Class;
  try {
    oneClass = await decode(ClassSchema, res.rows[0]);
  } catch {
    throw Error("Fields returned incorrectly in database");
  }

  return oneClass;
};
const  getAllClasses = async (): Promise<Class[]> => {
  const query = {
    text:  "SELECT e.name, cl.event_information_id, cl.min_level, cl.max_level, cl.rrstring, cl.start_time, cl.end_time, cl.language, u.id as user_id, u.first_name, u.last_name " +
        "FROM (((event_information e INNER JOIN classes cl ON e.id = cl.event_information_id) " +
        "INNER JOIN commitments ON commitments.event_information_id = e.id) " +
        " INNER JOIN users u ON commitments.user_id = u.id) WHERE role = 'Teacher'",
  };

  const res = await client.query(query);

  let classesWithUserInformation: Class[];

  try {
    classesWithUserInformation = await decode(ClassArraySchema, res.rows);
  } catch {
    throw Error("Fields returned incorrectly in database");
  }


  return classesWithUserInformation;
};

export { createClass, getClass, updateClass, getAllClasses };
