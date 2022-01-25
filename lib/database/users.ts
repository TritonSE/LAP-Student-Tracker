import { client } from "../db";
import { updateUserSchema, User, userSchema, UpdateUser } from "../../models/users";
import { array, InferType } from "yup";

const userArraySchema = array(userSchema).defined();
type userArrayType = InferType<typeof userArraySchema>;

// create a user in the database with given parameters.
const createUser = async (
  id: string,
  first_name: string,
  last_name: string,
  email: string,
  role: string,
  address: string,
  phone_number?: string
): Promise<User> => {
  const query = {
    text:
      "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES($1, $2, $3, $4, $5, $6, $7)" +
      "RETURNING  id, first_name, last_name, email, role, phone_number, address",
    values: [id, first_name, last_name, email, role, address, phone_number],
  };

  const res = await client.query(query);
  // basic error checking
  if (res.rowCount != 1) throw Error("Database returned the incorrect number of rows");

  let user: User;

  try {
    user = await userSchema.validate(res.rows[0]);
  } catch {
    throw Error("Error on return from database");
  }

  return user;
};

// updates user given new parameters
const updateUser = async (
  id: string,
  first_name?: string,
  last_name?: string,
  email?: string,
  role?: string,
  address?: string,
  phone_number?: string,
): Promise<User | null> => {
  const query = {
      text:"UPDATE users " +
      "SET first_name = COALESCE($2, first_name), "+ 
      "last_name = COALESCE($3, last_name), " +
      "email = COALESCE($4, email), " +
      "role = COALESCE($5, role), " +
      "address = COALESCE($6, address), " +
      "phone_number = COALESCE($7, phone_number) " + 
      "WHERE id=$1",
      values: [id, first_name, last_name, email, role, address, phone_number],
  }
        
    try {
        const res = await client.query(query);
    }
    catch{
        throw Error("Error on update user"); 
    }

  
  return getUser(id);
};

// get a user given an id
const getUser = async (id: string): Promise<User | null> => {
  const query = {
    text: "SELECT id, first_name, last_name, email, role, phone_number, address FROM users WHERE id = $1",
    values: [id],
  };

  const res = await client.query(query);

  if (res.rows.length == 0) {
    return null;
  }

  let user: User;
  try {
    user = await userSchema.validate(res.rows[0]);
  } catch {
    throw Error("Fields returned incorrectly in database");
  }

  return user;
};

// gets all staff in the database
const getStaff = async (): Promise<User[]> => {
  const query = {
    text: "SELECT id, first_name, last_name, email, role, phone_number, address FROM users WHERE role = 'Teacher' OR role = 'Admin'",
  };

  const res = await client.query(query);

  let user: userArrayType;

  try {
    user = await userArraySchema.validate(res.rows);
  } catch (e) {
    throw Error("Fields returned incorrectly in database");
  }

  return user;
};

export { createUser, getUser, updateUser, getStaff };
