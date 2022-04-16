import { Availibility, AvailibilitySchema } from "../../models/availibility";
import { client } from "../db";
import { decode } from "io-ts-promise";

const updateAvailability = async (
  id: string,
  mon: string[][] | null,
  tue: string[][] | null,
  wed: string[][] | null,
  thu: string[][] | null,
  fri: string[][] | null,
  sat: string[][] | null,
  timeZone: string
): Promise<Availibility | null> => {
  const query = {
    text:
      "UPDATE availabilities SET " +
      "mon = COALESCE($2, mon), " +
      "tue = COALESCE($3, tue), " +
      "wed = COALESCE($4, wed), " +
      "thu = COALESCE($5, thu), " +
      "fri = COALESCE($6, fri), " +
      "sat = COALESCE($7, sat),  " +
      "time_zone = COALESCE($8, time_zone) " +
      "WHERE user_id = $1",
    values: [id, mon, tue, wed, thu, fri, sat, timeZone],
  };
  try {
    await client.query(query);
  } catch (e) {
    throw Error("Error on update availability");
  }

  return getAvailabilityById(id);
};

const getAvailabilityById = async (id: string): Promise<Availibility | null> => {
  const query = {
    text: "SELECT mon, tue, wed, thu, fri, sat, time_zone FROM availabilities WHERE user_id = $1",
    values: [id],
  };

  const res = await client.query(query);
  if (res.rows.length == 0) {
    return null;
  }
  let availability: Availibility;
  try {
    availability = await decode(AvailibilitySchema, res.rows[0]);
  } catch (e) {
    throw Error("Fields returned incorrectly in database");
  }
  return availability;
};

export { getAvailabilityById, updateAvailability };
