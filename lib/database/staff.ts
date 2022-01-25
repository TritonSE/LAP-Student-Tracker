import { client } from "../db";
import { User, userSchema } from "../../models/users";
import { array, InferType } from "yup";

const userArraySchema = array(userSchema).defined();
type userArrayType = InferType<typeof userArraySchema>;

// gets all staff in the database
const getAllStaff = async (): Promise<User[]> => {
    const query = {
      text: "SELECT id, first_name, last_name, email, role, phone_number, address FROM users WHERE role = 'Teacher' OR role = 'Admin'",
    };
  
    const res = await client.query(query);
  
    let user: userArrayType;
  
    try {
      user = await userArraySchema.validate(res.rows);
    } catch (e) {
      throw Error("Fields returned incorrectly from database");
    }
  
    return user;
  };
  

  export { getAllStaff };
