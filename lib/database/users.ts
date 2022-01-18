import { client } from "../db";
import { User, userSchema } from "../../models/users";
import { string } from "yup/lib/locale";

/**
 * Creates a user and enters it into the database
 *
 *
 */
const createUser = async (
    id: string, 
    first_name: string,
    last_name: string,
    email: string,
    role: string,
    address:string,
    phone_number?: string,
): Promise<User> => {
  // basic query syntax. We will be using pg to work with postgres. Read more
  // it here: https://node-postgres.com/
  const query = {
    text:
      "INSERT INTO users(id, email, role, first_name, last_name, phone_number, address) VALUES($1, $2, $3, $4, $5, $6, $7)" +
      "RETURNING id, email, role, first_name, last_name, phone",
    values: [id, email, role, first_name, last_name, phone_number, address],
  };

  const res = await client.query(query);
  // basic error checking
  if (res.rowCount == 0) throw Error("Database returned 0 rows");

  let user: User;
  // validate if the schema returned conforms to the types we have set
  // We validate with Yup (document: https://github.com/jquense/yup)
  try {
    user = await userSchema.validate(res.rows[0]);
  } catch {
    throw Error("Error on return from database");
  }

  // return the created user
  return user;
};

const findUser = async (
  id: string,
): Promise<User> => {

  const query = {
    text: 
      "SELECT id, name, email, role, first_name, last_name, phone_number, address FROM users WHERE id = VALUE($1)", 
    values: [id]
  };

  const res = await client.query(query);

  console.log(res);
  let user: User;

  try {
    user = await userSchema.validate(res);
  }

  catch {
    throw Error("Error on return from database");
  }

  return user;
};

const findStaff = async (): Promise<User[]> => {
  const query = {
    text: 
      "SELECT id, name, email, role, first_name, last_name, phone_number, address FROM users WHERE role = Teacher OR role = Admin",
  };

  const res = await client.query(query);

  console.log(res);

  let user: User[] = [];


  return user;
}

export { createUser, findUser };