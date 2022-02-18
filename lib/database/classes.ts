import { client } from "../db";
import { Class, ClassSchema } from "../../models/classes";
import { decode } from "io-ts-promise";
const createClass = async (
  id: string,
  name: string,
  minLevel: number,
  maxLevel: number,
  rrstring: string,
  timeStart: string,
  timeEnd: string,
): Promise<Class | null> => {
  const query = {
    text: "INSERT INTO classes(id, name, minLevel, maxLevel, rrstring, timeStart, timeEnd) VALUES($1, $2, $3, $4, $5, $6, $7)",
    values: [id, name, minLevel, maxLevel, rrstring, timeStart, timeEnd],
  };

  try {
    await client.query(query);
  } catch {
    throw Error("Error on insert into database");
  }

  return getClass(id);
};

// updates class's veriables
const updateClass = async (
  id: string,
  name?: string,
  minLevel?: number,
  maxLevel?: number,
  rrstring?: string,
  timeStart?: string,
  timeEnd?: string
): Promise<Class | null> => {
  const query = {
    text:
      "UPDATE class " +
      "SET name = COALESCE($2, name), " +
      "minLevel = COALESCE($3, minLevel), " +
      "maxLevel = COALESCE($4, maxLevel), " +
      "rrstring = COALESCE($5, rrstring), " +
      "timeStart = COALESCE($6, timeStart), " +
      "timeEnd = COALESCE($7, timeEnd) " +
      "WHERE id=$1",
    values: [id, name, minLevel, maxLevel, rrstring, timeStart, timeEnd],
  };

  try {
    const res = await client.query(query);
  } catch {
    throw Error("Error on update class");
  }

  return getClass(id);
};

// get an id from a class
const getClass = async (id: string): Promise<Class | null> => {
  const query = {
    text: "SELECT id, name, minLevel, maxLevel, rrstring, timeStart, timeEnd FROM classes WHERE id = $1",
    values: [id],
  };

  const res = await client.query(query);

  if (res.rows.length == 0) {
    return null;
  }

  let classes: Class;
  try {
    classes = await decode(ClassSchema, res.rows[0]);
  } catch {
    throw Error("Fields returned incorrectly in database");
  }

  return classes;
};

export { createClass, getClass, updateClass };
