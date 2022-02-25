import { client } from "../db";
import { decode } from "io-ts-promise";
import { string } from "fp-ts";
import { userInfo } from "os";
import { Any, NullType } from "io-ts";

const createCommitment = async (
  user_id: string,
  event_information_id: string,
): Promise<Any[]> => {

  const query = {
    text: "INSERT INTO commitments(user_id, event_information_id) VALUES($1, $2)",
    values: [user_id, event_information_id],
  };

  let res;
  try {
    res = await client.query(query);
  } catch (e) {
    throw Error("Error on insert into database.");
  }

  return res.rows;
};

export { createCommitment };