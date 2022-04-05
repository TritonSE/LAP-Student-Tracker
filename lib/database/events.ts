import { client } from "../db";
import { User } from "../../models/users";
import { Interval } from "luxon";

class NonExistingTeacher extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, NonExistingTeacher.prototype);
  }
}

class TeacherConflictError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, TeacherConflictError.prototype);
  }
}

type resultIds = {
  classEventId: string;
  teacherIds: string[];
};

// Checks if the given teacher emails exist in the database and returns their IDs
const teachersExist = async (teachers: string[]): Promise<string[]> => {
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

  const teacherResult: User[] = res.rows;
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

  return teacherIds;
};

const validateTimes = async (teacherId: string, intervals: Interval[]): Promise<void> => {
  const query = {
    text:
      "SELECT c.start_str AS start, c.end_str AS end " +
      "FROM event_information e, calendar_information c, commitments cm " +
      "WHERE e.id = c.event_information_id AND e.id = cm.event_information_id " +
      "AND cm.user_id = $1",
    values: [teacherId],
  };

  let res;
  try {
    res = await client.query(query);
  } catch (e) {
    throw Error("Error on select of database.");
  }

  for (const calendarEvent of res.rows) {
    const calendarInterval: Interval = Interval.fromDateTimes(
      calendarEvent.start,
      calendarEvent.end
    );
    for (const interval of intervals) {
      if (calendarInterval.overlaps(interval))
        throw new TeacherConflictError("Teacher " + teacherId + " has conflict with class");
    }
  }
};

// Create an event in the database with given parameters
const createClassEvent = async (
  name: string,
  neverEnding: boolean,
  backgroundColor: string,
  teacherIds: string[]
): Promise<resultIds> => {
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

export { createClassEvent, validateTimes, teachersExist, NonExistingTeacher, TeacherConflictError };
