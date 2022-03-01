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
  timeStart?: string,
  timeEnd?: string,
  language?: string
): Promise<Class | null> => {
  const query = {
    text:
      "UPDATE classes " +
      "SET min_level = COALESCE($2, minLevel), " +
      "max_level = COALESCE($3, maxLevel), " +
      "rrstring = COALESCE($4, rrstring), " +
      "start_time = COALESCE($5, timeStart), " +
      "end_time = COALESCE($6, timeEnd) " +
      "language = COALESCE($7, language) " +
      "WHERE eventInformationId=$1",
    values: [eventInformationId, minLevel, maxLevel, rrstring, timeStart, timeEnd, language],
  };

  try {
    const res = await client.query(query);
  } catch {
    throw Error("Error on update class");
  }

  return getClass(eventInformationId);
};

// get an id from a class
const getClass = async (id: string): Promise<Class | null> => {
  const query = {
    text: "SELECT event_information_id, min_level, max_level, rrstring, start_time, end_time, language FROM classes WHERE event_information_id = $1",
    values: [id],
  };

  const res = await client.query(query);

  if (res.rows.length == 0) {
    return null;
  }

  var classes: Class;
  try {
    classes = await decode(ClassSchema, res.rows[0]);
  } catch {
    throw Error("Fields returned incorrectly in database");
  }

  return classes;
};

export { createClass, getClass, updateClass };
