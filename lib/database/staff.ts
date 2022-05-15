import { client } from "../db";
import { Staff, StaffSchema } from "../../models/staff";
import { array, TypeOf } from "io-ts";
import { decode } from "io-ts-promise";

const StaffArraySchema = array(StaffSchema);
type staffArrayType = TypeOf<typeof StaffArraySchema>;

const getAllStaff = async (): Promise<Staff[]> => {
  const query = {
    text:
      "SELECT users.id, users.first_name, users.last_name, users.email, users.role, " +
      "users.phone_number, users.address, users.picture_id, classes.min_level, classes.max_level, classes.language " +
      "FROM (((event_information INNER JOIN classes ON event_information.id = classes.event_information_id) " +
      "INNER JOIN commitments ON commitments.event_information_id = event_information.id) " +
      "FULL OUTER JOIN users ON commitments.user_id = users.id) WHERE role = 'Teacher' OR role = 'Staff' OR role = 'Admin';",
  };

  const res = await client.query(query);

  let staffArray: staffArrayType;

  try {
    staffArray = await decode(StaffArraySchema, res.rows);
  } catch (e) {
    console.log(e);
    throw Error("Fields returned incorrectly from database");
  }
  return staffArray;
};

export { getAllStaff };
