import { client } from "../db";
import { User, UserSchema } from "../../models/users";
import { decode } from "io-ts-promise";

const roleSpecificSetup = async (id: string, role: "Admin" | "Teacher" | "Student" | "Parent" | "Volunteer"): Promise<void> => {
  switch (role) {
    case "Teacher": {
      const query = {
        text: "INSERT INTO availibilities (user_id, time_zone) VALUES ($1, 	$2)",
        values: [id, "America/Los_Angeles"]
      }
      try {
        await client.query(query);
      } catch (e) {
        throw Error("Error on inserting into availibilities for teachers")
      }
      return;
    }
    default: return;
  }
}

// create a user in the database with given parameters.
const createUser = async (
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  role: "Admin" | "Teacher" | "Student" | "Parent" | "Volunteer",
  address?: string | null,
  phone_number?: string | null
): Promise<User | null> => {
  const query = {
    text: "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES($1, $2, $3, $4, $5, $6, $7)",
    values: [id, firstName, lastName, email, role, address, phone_number],
  };
  try {
    await client.query(query);
  } catch (e) {
    throw Error("Error on insert into database");
  }

  await roleSpecificSetup(id, role)
  return getUser(id);
};

// updates user given new parameters
const updateUser = async (
  id: string,
  firstName?: string,
  lastName?: string,
  email?: string,
  role?: string,
  address?: string,
  phone_number?: string | null
): Promise<User | null> => {
  const query = {
    text:
      "UPDATE users " +
      "SET first_name = COALESCE($2, first_name), " +
      "last_name = COALESCE($3, last_name), " +
      "email = COALESCE($4, email), " +
      "role = COALESCE($5, role), " +
      "address = COALESCE($6, address), " +
      "phone_number = COALESCE($7, phone_number) " +
      "WHERE id=$1",
    values: [id, firstName, lastName, email, role, address, phone_number],
  };

  try {
    await client.query(query);
  } catch {
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
    user = await decode(UserSchema, res.rows[0]);
  } catch (e) {
    throw Error("Fields returned incorrectly in database");
  }

  return user;
};

export { createUser, getUser, updateUser };
