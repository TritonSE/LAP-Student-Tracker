import { client } from "../db";
import { Announcement } from "../../models";
import { decode } from "io-ts-promise";
import { Any, array } from "io-ts";

const AnnouncementArraySchema = array(Announcement);

const getAnnouncements = async (classId: string): Promise<Announcement[]> => {
  const query = {
    text: "SELECT event_information_id, title, content, id FROM announcements WHERE event_information_id = $1",
    values: [classId],
  };
  const res = await client.query(query);

  try {
    return await decode(AnnouncementArraySchema, res.rows);
  } catch (e) {
    throw Error("Fields returned incorrectly in database.");
  }
};

const createAnnouncement = async (
  classId: string,
  title: string,
  content: string
): Promise<Any[]> => {
  const query = {
    text: "INSERT INTO announcements(event_information_id, title, content) VALUES($1, $2, $3)",
    values: [classId, title, content],
  };

  let res;
  try {
    res = await client.query(query);
  } catch (e) {
    throw Error("CustomError on inserting announcement into database.");
  }

  return res.rows;
};

const deleteAnnouncement = async (classId: string, id: string): Promise<Any[]> => {
  const query = {
    //text: "DELETE FROM (event_information INNER JOIN announcements ON event_information.id = announcements.event_information_id) " +
    //      "WHERE announcements.event_information_id = $1 AND announcements.id = $2",
    text: "DELETE FROM announcements WHERE event_information_id = $1 AND id = $2",
    values: [classId, id],
  };

  let res;
  try {
    res = await client.query(query);
  } catch (e) {
    throw Error("CustomError on delete announcement.");
  }
  return res.rows;
};

export { getAnnouncements, createAnnouncement, deleteAnnouncement };
