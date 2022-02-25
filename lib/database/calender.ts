import { client } from "../db";
import { decode } from "io-ts-promise";
import { string } from "fp-ts";
import { userInfo } from "os";
import { Any, NullType } from "io-ts";

const createCalenderEvent = async (
  id: string,
  startString: string,
  endString: string,
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