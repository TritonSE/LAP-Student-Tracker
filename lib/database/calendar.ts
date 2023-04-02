import { client } from "../db";
// Creates a calender event in database
const createCalendarEvent = async (
  id: string,
  startString: string,
  endString: string
): Promise<void> => {
  // Return type is Any[] because an empty array should be returned
  const query = {
    text: "INSERT INTO calendar_information(event_information_id, start_str, end_str) VALUES($1, $2, $3)",
    values: [id, startString, endString],
  };

  await client.query(query);

  return;
};

export { createCalendarEvent };
