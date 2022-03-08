import { client } from "../db";
import { User, UserSchema } from "../../models/users";
import { Staff, StaffSchema } from "../../models/staff";
import { array, TypeOf } from "io-ts";
import { decode } from "io-ts-promise";

const UserArraySchema = array(UserSchema);
type userArrayType = TypeOf<typeof UserArraySchema>;

const StaffArraySchema = array(StaffSchema);
type staffArrayType = TypeOf<typeof StaffArraySchema>;

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

const getAllStaff2 = async (): Promise<Staff[]> => {
  const query = {
    text: "SELECT id, minLevel, maxLevel FROM users WHERE role = 'Teacher'",
  };
  const res = await client.query(query);

  let teacherArray: staffArrayType;
}

export { getAllStaff };
