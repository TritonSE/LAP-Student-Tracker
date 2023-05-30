import { User } from "../../models";
import { array } from "io-ts";
import { decode } from "io-ts-promise";
import { client } from "../db";
const userArraySchema = array(User);

const getRoster = async (classId: string): Promise<User[]> => {
  const query = {
    text:
      " select users.id, users.first_name, users.last_name, users.email, users.role, users.picture_id, users.approved, users.date_created, users.phone_number, users.address, users.onboarded" +
      " from ((commitments INNER JOIN classes ON commitments.event_information_id = classes.event_information_id) " +
      "INNER JOIN users ON commitments.user_id = users.id) " +
      "WHERE classes.event_information_id = $1",
    values: [classId],
  };

  const res = await client.query(query);
  return await decode(userArraySchema, res.rows);
};

export { getRoster };
