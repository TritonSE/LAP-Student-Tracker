import { client } from "../db";
import { User, UserSchema } from "../../models/users";
import { Staff, StaffSchema } from "../../models/staff";
import { array, TypeOf } from "io-ts";
import { decode } from "io-ts-promise";

const UserArraySchema = array(UserSchema);
type userArrayType = TypeOf<typeof UserArraySchema>;

const StaffArraySchema = array(StaffSchema);
type staffArrayType = TypeOf<typeof StaffArraySchema>;

interface StaffMapType {
  id: number;
  [index:number]:number;
}

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

const getTeachers = async (): Promise<StaffMapType> => {
  const query = {
    text: "SELECT id, minLevel, maxLevel FROM users INNER JOIN classes ON users.name = classes.teacher ", 
  };

  const res = await client.query(query);

  let staffMap: StaffMapType;

  try {
    staffMap = {
      id: res.rows[0].id,
      [0]: res.rows[0].minLevel,
      [1]: res.rows[0].maxLevel,
    };
  }
  catch(e){
    throw Error("Fields returned incorrectly from database");
  }

  return staffMap;

};

export { getAllStaff, getTeachers };
