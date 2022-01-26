import { client } from "../db";
import { User, UserSchema } from "../../models/users";

// create a user in the database with given parameters.
const createUser = async (
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  role: string,
  address?: string,
  phone_number?: string
): Promise<User | null> => {
  const query = {
    text:
      "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES($1, $2, $3, $4, $5, $6, $7)",
<<<<<<< HEAD
    values: [id, firstName, lastName, email, role, address, phone_number],
=======
    values: [id, first_name, last_name, email, role, address, phone_number],
>>>>>>> e27a678f2dbf236d309a6a657a585cbd0b1783a8
  };

  try {
    await client.query(query);
  }
  catch {
    throw Error("Error on insert into database")
  }

  return getUser(id)
};

// updates user given new parameters
const updateUser = async (
  id: string,
  firstName?: string,
  lastName?: string,
  email?: string,
  role?: string,
  address?: string,
  phone_number?: string,
): Promise<User | null> => {
  const query = {
    text: "UPDATE users " +
      "SET first_name = COALESCE($2, first_name), " +
      "last_name = COALESCE($3, last_name), " +
      "email = COALESCE($4, email), " +
      "role = COALESCE($5, role), " +
      "address = COALESCE($6, address), " +
      "phone_number = COALESCE($7, phone_number) " +
      "WHERE id=$1",
<<<<<<< HEAD
    values: [id, firstName, lastName, email, role, address, phone_number],
=======
    values: [id, first_name, last_name, email, role, address, phone_number],
>>>>>>> e27a678f2dbf236d309a6a657a585cbd0b1783a8
  }

  try {
    const res = await client.query(query);
<<<<<<< HEAD
    console.log(res)
=======
>>>>>>> e27a678f2dbf236d309a6a657a585cbd0b1783a8
  }
  catch {
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

export { createUser, getUser, updateUser };
