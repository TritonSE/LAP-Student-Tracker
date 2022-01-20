import { client } from "../db";
import { User, userSchema, updateUserSchema } from "../../models/users";
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
      "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES($1, $2, $3, $4, $5, $6, $7)" +
      "RETURNING id, email, role, first_name, last_name, phone",
    values: [id, first_name, last_name, email, role, address, phone_number],
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

const updateUser = async (
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
      "UPDATE users SET first_name = COALESCE($2, first_name) last_name = COALESCE($3, last_name) email = COALESCE($3, email) role = COALESCE($4, role) address = COALESCE($5, address) phone_number = COALESCE($6, phone_number) WHERE id=$1" +
      "RETURNING id, email, role, first_name, last_name, phone",
    values: [first_name, last_name, email, role, address, phone_number],
  };

  const res = await client.query(query);
  // basic error checking
  if (res.rowCount == 0) throw Error("Database returned 0 rows");

  let user: User;
  // validate if the schema returned conforms to the types we have set
  // We validate with Yup (document: https://github.com/jquense/yup)
  try {
    user = await updateUserSchema.validate(res.rows[0]);
  } catch {
    throw Error("Error on return from database");
  }

  // return the created user
  return user;
};

export { createUser, updateUser };