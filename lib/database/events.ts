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
    text: "INSERT INTO events(name, background_color, type, never_ending) VALUES($1, $2, $3, $4) RETURNING id",
    values: [name, backgroundColor, language, neverEnding],
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