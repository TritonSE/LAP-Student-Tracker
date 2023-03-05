import { client } from "../db";
import {UpdateEvent, User} from "../../models";
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

// Checks if the given teacher emails exist in the database and returns the teacher user objects
const teachersExist = async (teachers: string[]): Promise<User[]> => {
  const query = {
    text: "SELECT * FROM users WHERE email = ANY ($1) AND role = 'Teacher'",
    values: [teachers],
  };

  const res = await client.query(query);

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

  return teacherResult;
};

const getTeacherById = async (teacherId: string): Promise<User> => {
  const query = {
    text: "SELECT * from users WHERE id = $1 AND role = 'Teacher'",
    values: [teacherId],
  };

  let res;
  try {
    res = await client.query(query);
  } catch (e) {
    throw Error("CustomError on select of database.");
  }

  const teacherResult: User[] = res.rows;
  if (teacherResult.length != 1) {
    throw new NonExistingTeacher(`Teacher with UUID ${teacherId} does not exist`);
  }

  return teacherResult[0];
};

// Checks whether teacher's current schedule conflicts with desired intervals
const validateTimes = async (teacher: User, intervals: Interval[]): Promise<void> => {
  const query = {
    text:
      "SELECT e.name, c.start_str AS start, c.end_str AS end " +
      "FROM event_information e, calendar_information c, commitments cm " +
      "WHERE e.id = c.event_information_id AND e.id = cm.event_information_id " +
      "AND cm.user_id = $1",
    values: [teacher.id],
  };

  // fetch all calendar start-end times teacher is committed to from db
  const res = await client.query(query);

  // helper function for sorting intervals
  const compareIntervals = (a: [string, Interval], b: [string, Interval]): number => {
    if (a[1].start > b[1].start) return 1;
    else if (a[1].start < b[1].start) return -1;
    return 0;
  };

  // Convert db results to teacher's current intervals and sort
  const currentEventIntervals: [string, Interval][] = res.rows
    .map((row) => [row.name, Interval.fromDateTimes(row.start, row.end)] as [string, Interval])
    .sort(compareIntervals);

  let currIntervalPtr = 0;
  let newIntervalPtr = 0;

  // Check for overlap between current time intervals and new intervals
  // Can assume currentEventIntervals and newIntervals are non-overlapping
  while (currIntervalPtr < currentEventIntervals.length && newIntervalPtr < intervals.length) {
    const currClass = currentEventIntervals[currIntervalPtr][0];
    const currInterval: Interval = currentEventIntervals[currIntervalPtr][1];
    const newInterval: Interval = intervals[newIntervalPtr];
    if (currInterval.overlaps(newInterval)) {
      throw new TeacherConflictError(
        `Teacher ${teacher.firstName} ${teacher.lastName} has conflict with class ${currClass}`
      );
    }
    if (currInterval.start < newInterval.start) {
      currIntervalPtr++;
    } else {
      newIntervalPtr++;
    }
  }
};

// Create an event in the database with given parameters and return id
const createEvent = async (
  name: string,
  neverEnding: boolean,
  type: string,
  backgroundColor: string
): Promise<string> => {
  const query = {
    text: "INSERT INTO event_information(name, background_color, type, never_ending) VALUES($1, $2, $3, $4) RETURNING id",
    values: [name, backgroundColor, type, neverEnding],
  };

  const res = await client.query(query);

  return res.rows[0].id;
};

const createClassEvent = async (
  name: string,
  neverEnding: boolean,
  backgroundColor: string
): Promise<string> => {
  return createEvent(name, neverEnding, "Class", backgroundColor);
};

const deleteEvent = async (id: string): Promise<string | null> => {
  const query = {
    text: "DELETE FROM event_information WHERE id = $1 RETURNING *",
    values: [id],
  };

  const res = await client.query(query);
  return res.rows[0].id;
};

const updateEvent = async(id: string, newEvent: UpdateEvent): Promise<void> => {
  const query = {
    text: "UPDATE event_information SET name = COALESCE($2, name) WHERE id = $1",
    values: [id, newEvent.name]
  }

  await client.query(query);
  return
};

export {
  createEvent,
  createClassEvent,
  validateTimes,
  teachersExist,
  getTeacherById,
  deleteEvent,
  updateEvent,
  NonExistingTeacher,
  TeacherConflictError,
};
