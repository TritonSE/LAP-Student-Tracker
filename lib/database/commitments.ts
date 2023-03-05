import { client } from "../db";
import { logger } from "../../logger/logger";

// Return type is Any[] because an empty array should be returned
const createCommitment = async (userId: string, eventInformationId: string): Promise<void> => {
  logger.info("Attempting to add user " + userId + " for commitment " + eventInformationId);
  const query = {
    text: "INSERT INTO commitments(user_id, event_information_id) VALUES($1, $2)",
    values: [userId, eventInformationId],
  };

  await client.query(query);

  logger.info("Added user " + userId + " for commitment " + eventInformationId);
  return;
};

const deleteCommitment = async (userId: string, eventInformationId: string): Promise<void> => {
  const query = {
    text: "DELETE FROM commitments WHERE user_id = $1 AND event_information_id = $2",
    values: [userId, eventInformationId],
  };

  await client.query(query);

  return;
};

export { createCommitment, deleteCommitment };
