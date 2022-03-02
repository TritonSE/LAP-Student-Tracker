import { client } from "../db";
import { User } from "../../models/users";

class NonExistingTeacher extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, NonExistingTeacher.prototype);
  }
}

type resultIds = {
  classEventId: string;
  teacherIds: string[];
};

// Checks if the given teachers exist in the database and returns them
const teachersExist = async (teachers: string[]): Promise<User[]> => {
  const query = {
    text: "SELECT * FROM users WHERE email = ANY ($1) AND role = 'Teacher'",
    values: [teachers],
  };

  let res;
  try {
    res = await client.query(query);
  } catch (e) {
    throw Error("Error on select of database.");
  }

  return res.rows;
};

// Create an event in the database with given parameters
const createClassEvent = async (
  name: string,
  neverEnding: boolean,
  backgroundColor: string,
  teachers: string[]
): Promise<resultIds> => {
  const teacherResult: User[] = await teachersExist(teachers);
  if (teacherResult.length != teachers.length) {
    const teacherEmailIDs = teacherResult.map((user) => user.email);
    const nonExistingTeachers = teachers
      .filter((emailId) => !teacherEmailIDs.includes(emailId))
      .join(" ");

    throw new NonExistingTeacher(
      "The following teachers { " + nonExistingTeachers + " } do not exist"
    );
  }
  const teacherIds = teacherResult.map((teacher) => teacher.id);

  const query = {
    text: "INSERT INTO event_information(name, background_color, type, never_ending) VALUES($1, $2, $3, $4) RETURNING id",
    values: [name, backgroundColor, "Class", neverEnding],
  };

  let res;
  try {
    res = await client.query(query);
  } catch (e) {
    throw Error("Error on insert into database.");
  }

  return {
    classEventId: res.rows[0].id,
    teacherIds: teacherIds,
  };
};

export { createClassEvent, NonExistingTeacher };
