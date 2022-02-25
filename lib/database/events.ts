import { client } from "../db";
import { Event, ClassEventSchema, CreateClassEvent, CreateClassEventSchema } from "../../models/events";
import { User, UserSchema } from "../../models/users";
import { decode } from "io-ts-promise";
import { string } from "fp-ts";
import { userInfo } from "os";
import { Any, NullType } from "io-ts";

// Checks if the given teachers exist in the database
const teachersExist = async (teachers: string[]): Promise<Any[]> => {
  const query = {
    text: "SELECT * FROM users WHERE email = ANY ($1) AND role = 'Teacher'",
    values: [teachers],
  };

  let res;
  try {
    res = await client.query(query);
  } catch (e) {
    throw Error("Error on select of database.");
  }

  return res.rows;
}

// Create an event in the database
const createClassEvent = async (
  name: string,
  startTime: string,
  endTime: string,
  timeZone: string,
  rrule: string,
  language: string,
  neverEnding: boolean,
  backgroundColor: string,
  teachers: string[],
): Promise<string> => {

  let teacherResult = await teachersExist(teachers);
  if (teacherResult.length != teachers.length) {
    return "";
  }

  const query = {
    text: "INSERT INTO event_information(name, background_color, type, never_ending) VALUES($1, $2, $3, $4) RETURNING id",
    values: [name, backgroundColor, 'Class', neverEnding],
  };
  
  let res;
  try {
    res = await client.query(query);
  } catch (e) {
    throw Error("Error on insert into database.");
  }
  
  return res.rows[0].id;
}

export { createClassEvent };