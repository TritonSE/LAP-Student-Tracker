import { client } from "../db";
import { Any } from "io-ts";

// Creates a calender event in database
const createCalenderEvent = async (
  id: string,
  startString: string,
  endString: string
): Promise<Any[]> => {
  const query = {
    text: "INSERT INTO calender_information(event_information_id, start_str, end_str) VALUES($1, $2, $3)",
    values: [id, startString, endString],
  };

  let res;
  try {
    res = await client.query(query);
  } catch (e) {
    throw Error("Error on insert into database.");
  }

  return res.rows;
};

export { createCalenderEvent };
