import { client } from "../db";
import { Any } from "io-ts";

// Creates a calender event in database
const createCalendarEvent = async (
  id: string,
  startString: string,
  endString: string
): Promise<Any[]> => {
  // Return type is Any[] because an empty array should be returned
  const query = {
    text: "INSERT INTO calendar_information(event_information_id, start_str, end_str) VALUES($1, $2, $3)",
    values: [id, startString, endString],
  };

  const res = await client.query(query);

  return res.rows;
};

export { createCalendarEvent };
