import { client } from "../db";
import { User, userSchema } from "../../models/users";
import { string, array, TypeOf } from "yup";

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
  address: string,
  phone_number?: string
): Promise<User> => {
  // basic query syntax. We will be using pg to work with postgres. Read more
  // it here: https://node-postgres.com/
  const query = {
    text:
      "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES($1, $2, $3, $4, $5, $6, $7)" +
      "RETURNING  id, first_name, last_name, email, role, phone_number, address",
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
  address: string,
  phone_number?: string
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
    user = await userSchema.validate(res.rows[0]);
  } catch {
    throw Error("Error on return from database");
  }

  // return the created user
  return user;
};

const findUser = async (id: string): Promise<User> => {
  console.log("here");
  const query = {
    text: "SELECT id, first_name, last_name, email, role, phone_number, address FROM users WHERE id = $1",
    values: [id],
  };

  const res = await client.query(query);

  console.log(res.rows[0]);
  let user: User;
  // console.log("here")
  try {
    user = await userSchema.validate(res.rows[0]);
  } catch {
    throw Error("Error on return from database");
  }

  return user;
};

const findStaff = async (): Promise<User[]> => {
  const query = {
    text: "SELECT id, first_name, last_name, email, role, phone_number, address FROM users WHERE role = 'Teacher' OR role = 'Admin'",
  };

  const res = await client.query(query);

  let userArraySchema = array(userSchema).defined();

  let user: TypeOf<typeof userArraySchema>;

  try {
    user = await userArraySchema.validate(res.rows);
  } catch (e) {
    throw Error("Error on return from database");
  }

  return user;
};

export { createUser, findUser, updateUser, findStaff };
