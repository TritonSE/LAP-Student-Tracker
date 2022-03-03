import { client } from "../db";
import { CalendarEvent, CalendarEventSchema } from "../../models/events";
import { array, TypeOf, Any } from "io-ts";
import { decode } from "io-ts-promise";

// Creates a calender event in database
const createCalendarEvent = async (
  id: string,
  startString: string,
  endString: string
): Promise<Any[]> => {
  // Return type is Any[] because an empty array should be returned
  const query = {
    text: "INSERT INTO calendar_information(event_information_id, start_str, end_str) VALUES($1, $2, $3)",
    values: [id, startString, endString],
  };

  let res;
  try {
    res = await client.query(query);
  } catch (e) {
    throw Error("Error on insert into database.");
  }

  return res.rows;
};

const CalendarEventArraySchema = array(CalendarEventSchema);
type calenderEventArrayType = TypeOf<typeof CalendarEventArraySchema>;

// Creates a calender event in database
const getEventFeed = async (
  start: string,
  end: string,
  userId?: string
): Promise<CalendarEvent[]> => {
  const query = {
    text:
      "SELECT e.id, e.name AS title, e.background_color, " +
      "TO_JSON(c.start_str) AS start_str, TO_JSON(c.end_str) AS end_str " +
      "FROM event_information e, calendar_information c, commitments cm " +
      "WHERE e.id=c.event_information_id AND e.id=cm.event_information_id AND " +
      "c.start_str >= $1 AND c.end_str <= $2 AND cm.user_id LIKE COALESCE($3, '%')",
    values: [start, end, userId],
  };

  const res = await client.query(query);
  let calendarEventArray: calenderEventArrayType;

  try {
    calendarEventArray = await decode(CalendarEventArraySchema, res.rows);
  } catch (e) {
    throw Error("Error getting calendar event feed from database.");
  }

  return calendarEventArray;
};

export { createCalendarEvent, getEventFeed };
