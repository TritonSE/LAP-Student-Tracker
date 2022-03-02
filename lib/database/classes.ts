import { client } from "../db";
import { Class, ClassSchema } from "../../models/class";
import { decode } from "io-ts-promise";
const createClass = async (
  eventInformationId: string,
  minLevel: number,
  maxLevel: number,
  rrstring: string,
  timeStart: string,
  timeEnd: string,
  language: string
): Promise<Class | null> => {
  const query = {
    text: "INSERT INTO classes(event_information_id, min_level, max_level, rrstring, start_time, end_time, language) VALUES($1, $2, $3, $4, $5, $6, $7)",
    values: [eventInformationId, minLevel, maxLevel, rrstring, timeStart, timeEnd, language],
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
  language?: string
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
    values: [eventInformationId, minLevel, maxLevel, rrstring, startTime, endTime, language],
  };

  try {
    await client.query(query);
  } catch (e) {
    throw Error("Error on update class");
  }

  return getClass(eventInformationId);
};

// get an id from a class
const getClass = async (id: string): Promise<Class | null> => {
  const query = {
    text: "SELECT e.name, c.event_information_id, c.min_level, c.max_level, c.rrstring, c.start_time, c.end_time, c.language FROM event_information e, classes c WHERE e.id = c.event_information_id AND e.type = 'class' AND c.event_information_id = $1",
    values: [id],
  };

  const res = await client.query(query);
  if (res.rows.length == 0) {
    return null;
  }

  let classes: Class;
  try {
    classes = await decode(ClassSchema, res.rows[0]);
  } catch {
    throw Error("Fields returned incorrectly in database");
  }

  return classes;
};

export { createClass, getClass, updateClass };
