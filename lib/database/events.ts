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

  const res = await client.query(query);
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
): Promise<Any | null> => {

  let teacherResult = await teachersExist(teachers);
  if (teacherResult.length != teachers.length) {
    return null;
  }

  const query = {
    text: "INSERT INTO events(name, background_color, type, never_ending) VALUES($1, $2, $3, $4) RETURNING id",
    values: [name, backgroundColor, 'Class', neverEnding],
  };
  

  client.query(query.text, query.values, (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      return res;
    }
  });
  
  return null;
}

export { createClassEvent };