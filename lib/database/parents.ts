import { client } from "../db";
import { Any } from "io-ts";

// Creates a parent-student link in database
const linkParentAndStudent = async (
  parent_id: string,
  student_id: string,
): Promise<Any[]> => {
  // Return type is Any[] because an empty array should be returned
  const query = {
    text: "INSERT INTO parents(parent_id, student_id) VALUES($1, $2)",
    values: [parent_id, student_id],
  };

  const res = await client.query(query);

  return res.rows;
};

export { linkParentAndStudent };
