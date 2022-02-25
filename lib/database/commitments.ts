import { client } from "../db";
import { Any } from "io-ts";

const createCommitment = async (user_id: string, event_information_id: string): Promise<Any[]> => {
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
