import { client } from "../db";
import { Any } from "io-ts";
import { logger } from "../../logger/logger";

// Return type is Any[] because an empty array should be returned
const createCommitment = async (userId: string, eventInformationId: string): Promise<Any[]> => {
  logger.info("Attempting to add user " + userId + " for commitment " + eventInformationId);
  const query = {
    text: "INSERT INTO commitments(user_id, event_information_id) VALUES($1, $2)",
    values: [userId, eventInformationId],
  };

  const res = await client.query(query);

  logger.info("Added user " + userId + " for commitment " + eventInformationId);
  return res.rows;
};

const deleteCommitment = async (userId: string, eventInformationId: string): Promise<Any[]> => {
  const query = {
    text: "DELETE FROM commitments WHERE user_id = $1 AND event_information_id = $2",
    values: [userId, eventInformationId],
  };

  const res = await client.query(query);

  return res.rows;
};

export { createCommitment, deleteCommitment };
