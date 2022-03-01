import { client } from "../db";
import { Any } from "io-ts";

const createCommitment = async (userId: string, eventInformationId: string): Promise<Any[]> => {
  const query = {
    text: "INSERT INTO commitments(user_id, event_information_id) VALUES($1, $2)",
    values: [userId, eventInformationId],
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
