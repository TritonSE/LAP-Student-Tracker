import { string } from "fp-ts"
import { Availibility, AvailibilitySchema } from "../../models/availibility"
import { client } from "../db"
import { decode } from "io-ts-promise";

const updateAvailibility = async (id: string, mon: string[][] | null, tue: string[][] | null, wed: string[][] | null, thu: string[][] | null, fri: string[][] | null, sat: string[][] | null): Promise<Availibility | null> => {
  const query = {
    text: "UPDAE availibilities " +
      "SET mon = COALESCE($2, mon), " +
      "SET tue = COALESCE($3, tue), " +
      "SET wed = COALESCE($3, wed), " +
      "SET thu = COALESCE($3, thu), " +
      "SET fri = COALESCE($3, fri), " +
      "SET sat = COALESCE($3, sat), " +
      "WHERE user_id = $1",
    values: [id, mon, tue, wed, thu, fri, sat]
  }
  try {
    await client.query(query);
  } catch {
    throw Error("Error on update availibility")
  }

  return getAvailibilityById(id);
}

const getAvailibilityById = async (id: string): Promise<Availibility | null> => {
  const query = {
    text: "SELECT mon, tue, wed, thu, fri, sat FROM availibilities WHERE id = $1",
    values: [id]
  }

  const res = await client.query(query);
  if (res.rows.length == 0) {
    return null
  }
  let availibility: Availibility;
  try { availibility = await decode(AvailibilitySchema, res.rows[0]) } catch (e) {
    throw Error("Fields returned incorrectly in database")
  }
  return availibility;

}

export { getAvailibilityById, updateAvailibility }