import { client } from "../db";
import { User, userSchema } from "../../models/users";
import { string } from "yup/lib/locale";

/**
 * Creates a user and enters it into the database
 *
 *
 */
const createUser = async (
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
      "INSERT INTO users(email, role, first_name, last_name, phone_number, address) VALUES($1, $2, $3, $4, $5, $6)" +
      "RETURNING id, email, role, first_name, last_name, phone",
    values: [email, role, first_name, last_name, phone_number, address],
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

export { createUser };