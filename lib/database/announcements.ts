import { client } from "../db";
import { Announcement } from "../../models";
import { decode } from "io-ts-promise";
import { array } from "io-ts";

const AnnouncementArraySchema = array(Announcement);

const getAnnouncements = async (classId: string): Promise<Announcement[]> => {
  const query = {
    text: "SELECT event_information_id, title, content, announcement_id FROM announcements WHERE event_information_id = $1",
    values: [classId],
  };
  const res = await client.query(query);

  return await decode(AnnouncementArraySchema, res.rows);
};

const createAnnouncement = async (
  classId: string,
  title: string,
  content: string
): Promise<Announcement | null> => {
  const query = {
    text:
      "INSERT INTO announcements(event_information_id, title, content) VALUES($1, $2, $3) " +
      "RETURNING event_information_id, title, content, announcement_id",
    values: [classId, title, content],
  };

  const res = await client.query(query);
  const announcement = await decode(Announcement, res.rows[0]);

  return announcement;
};

const deleteAnnouncement = async (
  classId: string,
  announcementId: string
): Promise<Announcement | null> => {
  const query = {
    text: "DELETE FROM announcements WHERE event_information_id = $1 AND announcement_id = $2 RETURNING *",
    values: [classId, announcementId],
  };

  const res = await client.query(query);

  if (res.rows.length == 0) {
    return null;
  }

  const deletedAnnouncement = await decode(Announcement, res.rows[0]);

  return deletedAnnouncement;
};

export { getAnnouncements, createAnnouncement, deleteAnnouncement };
