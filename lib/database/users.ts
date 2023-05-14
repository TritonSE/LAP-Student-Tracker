import { client } from "../db";
import { User } from "../../models";
import { decode } from "io-ts-promise";
import { array } from "io-ts";
const UserArraySchema = array(User);

const roleSpecificSetup = async (
  id: string,
  role: "Admin" | "Teacher" | "Student" | "Parent" | "Volunteer"
): Promise<void> => {
  switch (role) {
    case "Volunteer":
    case "Teacher":
      const query = {
        text: "INSERT INTO availabilities (user_id, time_zone) VALUES ($1, 	$2)",
        values: [id, "America/Los_Angeles"],
      };
      await client.query(query);
      return;
    default:
      return;
  }
};

// create a user in the database with given parameters.
const createUser = async (
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  role: "Admin" | "Teacher" | "Student" | "Parent" | "Volunteer",
  imgId: string | null
): Promise<User | null> => {
  const approved = process.env.ALWAYS_APPROVE
    ? process.env.ALWAYS_APPROVE == "true"
    : !(role == "Admin" || role == "Teacher" || role == "Student" || role == "Volunteer");
  const currentDate = new Date();
  const dateCreated = currentDate.toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
  });
  const trimmedFirstName = firstName.trim();
  const trimmedLastName = lastName.trim();
  const query = {
    text: "INSERT INTO users(id, first_name, last_name, email, role, approved, date_created, picture_id, onboarded) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9 )",
    values: [
      id,
      trimmedFirstName,
      trimmedLastName,
      email,
      role,
      approved,
      dateCreated,
      imgId,
      role != "Volunteer",
    ],
  };
  await client.query(query);

  await roleSpecificSetup(id, role);
  return getUser(id);
};

// updates user given new parameters
const updateUser = async (
  id: string,
  firstName?: string,
  lastName?: string,
  email?: string,
  role?: string,
  approved?: boolean,
  address?: string | null,
  phone_number?: string | null,
  onboarded?: boolean
): Promise<User | null> => {
  const query = {
    text:
      "UPDATE users " +
      "SET first_name = COALESCE($2, first_name), " +
      "last_name = COALESCE($3, last_name), " +
      "email = COALESCE($4, email), " +
      "role = COALESCE($5, role), " +
      "approved = COALESCE($6, approved)," +
      "address = COALESCE($7, address), " +
      "phone_number = COALESCE($8, phone_number), " +
      "onboarded = COALESCE($9, onboarded) " +
      "WHERE id=$1",
    values: [id, firstName, lastName, email, role, approved, address, phone_number, onboarded],
  };

  await client.query(query);

  return getUser(id);
};

// get a user given an id
const getUser = async (id: string): Promise<User | null> => {
  const query = {
    text: "SELECT id, first_name, last_name, email, role, phone_number, address, picture_id, approved, date_created, onboarded FROM users WHERE id = $1",
    values: [id],
  };

  const res = await client.query(query);

  if (res.rows.length == 0) {
    return null;
  }

  return await decode(User, res.rows[0]);
};

const getUserByEmail = async (email: string): Promise<User | null> => {
  const query = {
    text: "SELECT id, first_name, last_name, email, role, phone_number, address, picture_id, approved, date_created, onboarded FROM users WHERE email = $1",
    values: [email],
  };

  const res = await client.query(query);

  if (res.rows.length == 0) {
    return null;
  }

  return await decode(User, res.rows[0]);
};

const deleteUser = async (id: string): Promise<boolean> => {
  const query = {
    text: "delete from users where id = $1",
    values: [id],
  };

  await client.query(query);

  return true;
};

const getAllUsers = async (): Promise<User[]> => {
  const query = {
    text: "SELECT id, first_name, last_name, email, role, approved, date_created, picture_id, phone_number, address, onboarded FROM users",
  };

  const res = await client.query(query);
  return await decode(UserArraySchema, res.rows);
};

export { createUser, getUser, getUserByEmail, updateUser, getAllUsers, deleteUser };
