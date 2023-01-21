import { client } from "../db";
import { array } from "io-ts";
import { User } from "../../models";
import { decode } from "io-ts-promise";

const UserArraySchema = array(User);

// Creates a parent-student link in database
const linkParentAndStudent = async (parent_id: string, student_id: string): Promise<void> => {
  // Return type is Any[] because an empty array should be returned
  const query = {
    text: "INSERT INTO parents(parent_id, student_id) VALUES($1, $2)",
    values: [parent_id, student_id],
  };

  await client.query(query);

  const approveStudentQuery = {
    text: "UPDATE users SET approved = true WHERE id = $1",
    values: [student_id],
  };

  await client.query(approveStudentQuery);
};

const getAllStudentsWithAParent = async (parentId: string): Promise<User[]> => {
  const query = {
    text: "SELECT * FROM users INNER JOIN parents on id = student_id WHERE parent_id  = $1",
    values: [parentId],
  };

  const res = await client.query(query);
  return await decode(UserArraySchema, res.rows);
};

export { linkParentAndStudent, getAllStudentsWithAParent };
