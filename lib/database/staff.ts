import { client } from "../db";
import { User, UserSchema } from "../../models/users";
import { array, TypeOf } from "io-ts";
import { decode } from "io-ts-promise";

const UserArraySchema = array(UserSchema);
type userArrayType = TypeOf<typeof UserArraySchema>;

// gets all staff in the database
const getAllStaff = async (): Promise<User[]> => {
  const query = {
    text: "SELECT id, first_name, last_name, email, role, phone_number, address FROM users WHERE role = 'Teacher' OR role = 'Admin'",
  };

  const res = await client.query(query);

  let staffArray: userArrayType;

  try {
    staffArray = await decode(UserArraySchema, res.rows);
  } catch (e) {
    throw Error("Fields returned incorrectly from database");
  }

  return staffArray;
};

export { getAllStaff };
