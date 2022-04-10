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

// Checks whether teacher's current schedule conflicts with desired intervals
const validateTimes = async (teacherId: string, intervals: Interval[]): Promise<void> => {
  const query = {
    text:
      "SELECT c.start_str AS start, c.end_str AS end " +
      "FROM event_information e, calendar_information c, commitments cm " +
      "WHERE e.id = c.event_information_id AND e.id = cm.event_information_id " +
      "AND cm.user_id = $1",
    values: [teacherId],
  };

  // fetch all calendar start-end times teacher is committed to from db
  let res;
  try {
    res = await client.query(query);
  } catch (e) {
    throw Error("Error on select of database.");
  }

  // helper function for sorting intervals
  const compareIntervals = (a: Interval, b: Interval): number => {
    if (a.start > b.start) return 1;
    else if (a.start < b.start) return -1;
    return 0;
  };

  // Convert db results to teacher's current intervals and sort
  const currentEventIntervals: Interval[] = res.rows
    .map((event) => Interval.fromDateTimes(event.start, event.end))
    .sort(compareIntervals);

  // Sort new intervals
  const newIntervals: Interval[] = intervals.sort(compareIntervals);

  console.log("PRINTING CURRENT INTERVALS");
  currentEventIntervals.forEach((i) => {
    if (i.start.day == 1) {
      console.log(i.start);
      console.log(i.end);
      console.log("DONE");
    }
  });

  console.log("PRINTING CURRENT INTERVALS");
  newIntervals.forEach((i) => {
    if (i.start.day == 1) {
      console.log(i.start);
      console.log(i.end);
      console.log("DONE");
    }
  });

  let currIntervalPtr = 0;
  let newIntervalPtr = 0;

  // Check for overlap between current time intervals and new intervals
  // Can assume currentEventIntervals and newIntervals are non-overlapping
  while (currIntervalPtr < currentEventIntervals.length && newIntervalPtr < newIntervals.length) {
    const currInterval: Interval = currentEventIntervals[currIntervalPtr];
    const newInterval: Interval = newIntervals[newIntervalPtr];
    if (currInterval.overlaps(newInterval)) {
      // console.log("CURR")
      // console.log(currInterval.start)
      // console.log(currInterval.end)

      // console.log("NEW")
      // console.log(newInterval.start)
      // console.log(newInterval.end)

      throw new TeacherConflictError("Teacher " + teacherId + " has conflict with class");
    }
    if (currInterval.start < newInterval.start) {
      currIntervalPtr++;
    } else {
      newIntervalPtr++;
    }
  }
};

// Create an event in the database with given parameters and return id
const createClassEvent = async (
  name: string,
  neverEnding: boolean,
  backgroundColor: string
): Promise<string> => {
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

  return res.rows[0].id;
};

export { createClassEvent, validateTimes, teachersExist, NonExistingTeacher, TeacherConflictError };
