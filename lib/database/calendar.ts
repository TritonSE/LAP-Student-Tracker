import { client } from "../db";
import { CalendarEvent, CalendarEventSchema } from "../../models/events";
import { array, TypeOf } from "io-ts";
import { decode } from "io-ts-promise";

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
      "FROM event_information e, calender_information c, commitments cm " +
      "WHERE e.id=c.event_information_id AND e.id=cm.event_information_id AND " +
      "c.start_str >= $1 AND c.end_str <= $2 AND cm.user_id LIKE COALESCE($3, '%')",
    values: [start, end, userId],
  };

  const res = await client.query(query);
  let calendarEventArray: calenderEventArrayType;

  try {
    console.log(res.rows);
    calendarEventArray = await decode(CalendarEventArraySchema, res.rows);
  } catch (e) {
    throw Error("Error getting calendar event feed from database.");
  }

  return calendarEventArray;
};

export { getEventFeed };
