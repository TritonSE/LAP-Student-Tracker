import { client } from "../db";
import { Class, ClassSchema } from "../../models/class";
import { decode } from "io-ts-promise";
import { array, TypeOf } from "io-ts";

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
  teachers: string[]
): Promise<Class | null> => {
  const query = {
    text: "INSERT INTO classes(event_information_id, min_level, max_level, rrstring, start_time, end_time, language, teachers) VALUES($1, $2, $3, $4, $5, $6, $7, $8",
    values: [eventInformationId, minLevel, maxLevel, rrstring, timeStart, timeEnd, language, teachers],
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
  teachers?: string[]
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
      "teachers = COALESCE($8, teachers) " +
      "WHERE event_information_id=$1",
    values: [eventInformationId, minLevel, maxLevel, rrstring, startTime, endTime, language, teachers],
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
    text: "SELECT e.name, c.event_information_id, c.min_level, c.max_level, c.rrstring, c.start_time, c.end_time, c.language, c.teachers FROM event_information e, classes c WHERE e.id = c.event_information_id AND e.type = 'Class' AND c.event_information_id = $1",
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
const getAllClasses = async (): Promise<Class[]> => {
  const query = {
    text: "SELECT e.name, c.event_information_id, c.min_level, c.max_level, c.rrstring, c.start_time, c.end_time, c.language, c.teachers FROM event_information e, classes c WHERE e.id = c.event_information_id AND e.type = 'Class'",
  };

  const res = await client.query(query);

  let classesArray: classArrayType;
  try {
    classesArray = await decode(ClassArraySchema, res.rows);
  } catch {
    throw Error("Fields returned incorrectly in database");
  }

  return classesArray;
};

export { createClass, getClass, updateClass, getAllClasses };
