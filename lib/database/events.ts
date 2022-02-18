import { client } from "../db";
import { Event, ClassEventSchema, CreateEvent, CreateClassEventSchema } from "../../models/events";
import { decode } from "io-ts-promise";
import { string } from "fp-ts";
import { userInfo } from "os";
import { Any, NullType } from "io-ts";

// Create an event in the database
const createEvent = async (
  name: string,
  startTime: string,
  endTime: string,
  timeZone: string,
  rrule: string,
  language: string,
  neverEnding: boolean,
  backgroundColor: string,
  teachers: string[],
): Promise<Any | void> => {
  const query = {
    text: "INSERT INTO events(name, startTime, endTime, timeZone, rrule, language, neverEnding, backgroundColor, teachers) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
    values: [name, startTime, endTime, timeZone, rrule, language, neverEnding, backgroundColor, teachers],
  };
  
  client.query(query.text, query.values, (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      return res;
    }
  });
  
}

export { createEvent };