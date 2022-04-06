import { client } from "../db";
import { User, UserSchema } from "../../models/users";
import { Staff, StaffSchema } from "../../models/staff";
import { array, Int, TypeOf } from "io-ts";
import { decode } from "io-ts-promise";

const UserArraySchema = array(UserSchema);
type userArrayType = TypeOf<typeof UserArraySchema>;

const StaffArraySchema = array(StaffSchema);
type staffArrayType = TypeOf<typeof StaffArraySchema>;

// interface StaffMapType {
//   id: number;
//   [index: number]: number;
// }

// {
//   user_id: {
//     classes: [],
//     languages: [],
//   }
// }

// // gets all staff in the database
// const getAllStaff = async (): Promise<User[]> => {
//   const query = {
//     text: "SELECT id, first_name, last_name, email, role, phone_number, address FROM users WHERE role = 'Teacher' OR role = 'Admin'",
//   };

//   const res = await client.query(query);

//   let staffArray: userArrayType;

//   try {
//     staffArray = await decode(UserArraySchema, res.rows);
//   } catch (e) {
//     throw Error("Fields returned incorrectly from database");
//   }

//   return staffArray;
// };

const getAllStaff = async (): Promise<Staff[]> => {
  const query = {
    text: "SELECT users.id, users.role, classes.min_level, classes.max_level, classes.language FROM (((event_information INNER JOIN classes ON event_information.id = classes.event_information_id) INNER JOIN commitments ON commitments.event_information_id = event_information.id) FULL OUTER JOIN users ON commitments.user_id = users.id) WHERE role = 'Teacher' or role = 'Staff';",
  };

  const res = await client.query(query);

  console.log(res);

  // TODO: parse and structure response into a map with user_id mapped to classes and languages
  // let staffMap: Map<Int, Int[]>;

  try {
    if(res.rows[0].role === "Teacher"){    }

    // check if teacher
    // res.rows.map((row:any) => {
    //   if (!staffMap.has(row.user_id)) {
    //     staffMap.set(row.user_id, [row.event_information_id]);
    //   } else {
    //     staffMap.set(row.user_id, [...staffMap.get(row.user_id), row.event_information_id]);
    //   }
    // });
  } catch (e) {
    console.log(e);
    throw Error("Fields returned incorrectly from database");
  }

  // return staffMap;

  // update once data is properly parsed
  return new Map<Int, Int[]>();
};

export { getAllStaff };
// , getTeachers
