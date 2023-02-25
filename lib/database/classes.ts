import { client } from "../db";
import { Class } from "../../models";
import { decode } from "io-ts-promise";
import { array, TypeOf } from "io-ts";
import * as t from "io-ts";
import { DateTime, Interval } from "luxon";
import { logger } from "../../logger/logger";
import RRule from "rrule";
import { createCalendarEvent } from "./calendar";

const ClassWithUserInformationSchema = t.type({
  name: t.string,
  eventInformationId: t.string,
  minLevel: t.number,
  maxLevel: t.number,
  rrstring: t.string,
  startTime: t.string,
  endTime: t.string,
  language: t.string,
  userId: t.string,
  firstName: t.string,
  lastName: t.string,
});
const ClassWithUserInformationArraySchema = array(ClassWithUserInformationSchema);

type ClassWithUserInformation = TypeOf<typeof ClassWithUserInformationSchema>;

type ClassWithoutTeacherInfo = {
  name: string;
  eventInformationId: string;
  minLevel: number;
  maxLevel: number;
  rrstring: string;
  startTime: string;
  endTime: string;
  language: string;
};
const ClassWithoutTeacherInfoSchema = t.type({
  name: t.string,
  eventInformationId: t.string,
  minLevel: t.number,
  maxLevel: t.number,
  rrstring: t.string,
  startTime: t.string,
  endTime: t.string,
  language: t.string,
});
const ClassWithoutTeacherInfoArraySchema = array(ClassWithoutTeacherInfoSchema);

const createClass = async (
  eventInformationId: string,
  minLevel: number,
  maxLevel: number,
  rrstring: string,
  timeStart: string,
  timeEnd: string,
  language: string
): Promise<Class | null> => {
  const query = {
    text: "INSERT INTO classes(event_information_id, min_level, max_level, rrstring, start_time, end_time, language) VALUES($1, $2, $3, $4, $5, $6, $7)",
    values: [eventInformationId, minLevel, maxLevel, rrstring, timeStart, timeEnd, language],
  };

  await client.query(query);

  return getClass(eventInformationId);
};

// updates class's variables
const updateClass = async (
  eventInformationId: string,
  minLevel?: number,
  maxLevel?: number,
  rrstring?: string,
  startTime?: string,
  endTime?: string,
  language?: string
): Promise<Class | null> => {
  const query = {
    text:
      "UPDATE classes " +
      "SET min_level = COALESCE($2, min_level), " +
      "max_level = COALESCE($3, max_level), " +
      "rrstring = COALESCE($4, rrstring), " +
      "start_time = COALESCE($5, start_time), " +
      "end_time = COALESCE($6, end_time), " +
      "language = COALESCE($7, language) " +
      "WHERE event_information_id=$1",
    values: [eventInformationId, minLevel, maxLevel, rrstring, startTime, endTime, language],
  };

  await client.query(query);

  return getClass(eventInformationId);
};

// get a class given the id
const getClass = async (id: string): Promise<Class | null> => {
  const query = {
    text:
      "SELECT e.name, cl.event_information_id, cl.min_level, cl.max_level, cl.rrstring, cl.start_time, cl.end_time, cl.language, u.id as user_id, u.first_name, u.last_name " +
      "FROM (((event_information e INNER JOIN classes cl ON e.id = cl.event_information_id)" +
      "INNER JOIN commitments ON commitments.event_information_id = e.id) " +
      " INNER JOIN users u ON commitments.user_id = u.id) WHERE role = 'Teacher' AND cl.event_information_id = $1",
    values: [id],
  };
  const res = await client.query(query);

  if (res.rows.length == 0) {
    return null;
  }

  const classesWithUserInformation = await decode(ClassWithUserInformationArraySchema, res.rows);

  const classInfo: Class = {
    name: classesWithUserInformation[0].name,
    eventInformationId: classesWithUserInformation[0].eventInformationId,
    minLevel: classesWithUserInformation[0].minLevel,
    maxLevel: classesWithUserInformation[0].maxLevel,
    rrstring: classesWithUserInformation[0].rrstring,
    startTime: classesWithUserInformation[0].startTime,
    endTime: classesWithUserInformation[0].endTime,
    language: classesWithUserInformation[0].language,
    teachers: [],
  };

  // go through result from the database query and add all teachers into classInfo
  classesWithUserInformation.forEach((classesWithUserInformation) => {
    classInfo.teachers.push({
      userId: classesWithUserInformation.userId,
      firstName: classesWithUserInformation.firstName,
      lastName: classesWithUserInformation.lastName,
    });
  });

  return classInfo;
};

const getAllClasses = async (): Promise<Class[]> => {
  const query = {
    text:
      "SELECT e.name, cl.event_information_id, cl.min_level, cl.max_level, cl.rrstring, cl.start_time, cl.end_time, cl.language, u.id as user_id, u.first_name, u.last_name " +
      "FROM (((event_information e INNER JOIN classes cl ON e.id = cl.event_information_id) " +
      "INNER JOIN commitments ON commitments.event_information_id = e.id) " +
      " INNER JOIN users u ON commitments.user_id = u.id) WHERE role = 'Teacher'",
  };
  const res = await client.query(query);
  let classesWithUserInformation: ClassWithUserInformation[];
  try {
    classesWithUserInformation = await decode(ClassWithUserInformationArraySchema, res.rows);
  } catch {
    throw Error("Fields returned incorrectly in database");
  }
  const classesArray: Class[] = [];
  const classToTeacherMap = new Map();
  const individualClasses: ClassWithoutTeacherInfo[] = [];
  // process data to get classes mapped to a list of teacher assigned to them
  classesWithUserInformation.forEach((classWithUserInformation) => {
    if (!classToTeacherMap.has(classWithUserInformation.eventInformationId)) {
      // this is a class that has not been encountered before
      const newClass = {
        name: classWithUserInformation.name,
        eventInformationId: classWithUserInformation.eventInformationId,
        minLevel: classWithUserInformation.minLevel,
        maxLevel: classWithUserInformation.maxLevel,
        rrstring: classWithUserInformation.rrstring,
        startTime: classWithUserInformation.startTime,
        endTime: classWithUserInformation.endTime,
        language: classWithUserInformation.language,
      };
      // add to the individual class array
      individualClasses.push(newClass);
      const newClassTeacher = {
        userId: classWithUserInformation.userId,
        firstName: classWithUserInformation.firstName,
        lastName: classWithUserInformation.lastName,
      };
      // create a teacher array to be the value of the class to teacher map
      const teachersArr = [newClassTeacher];
      classToTeacherMap.set(classWithUserInformation.eventInformationId, teachersArr);
    } else {
      // we have seen this teacher before, so we just add the teacher to the map
      const newTeacher = {
        userId: classWithUserInformation.userId,
        firstName: classWithUserInformation.firstName,
        lastName: classWithUserInformation.lastName,
      };
      const teachersArr = classToTeacherMap.get(classWithUserInformation.eventInformationId);
      teachersArr.push(newTeacher);

      classToTeacherMap.set(classWithUserInformation.eventInformationId, teachersArr);
    }
  });

  // process map to get class and teacher into the same data structure
  individualClasses.forEach((singleClass) => {
    const currClass: Class = {
      name: singleClass.name,
      eventInformationId: singleClass.eventInformationId,
      minLevel: singleClass.minLevel,
      maxLevel: singleClass.maxLevel,
      rrstring: singleClass.rrstring,
      startTime: singleClass.startTime,
      endTime: singleClass.endTime,
      language: singleClass.language,
      teachers: classToTeacherMap.get(singleClass.eventInformationId),
    };
    classesArray.push(currClass);
  });

  return classesArray;
};

const addDatesToUnlimitedClass = async (eventInformationId: string): Promise<void> => {
  const query = {
    text:
      "SELECT cl.rrstring, to_json(ci.start_str) as start_str_tmp, to_json(ci.end_str) as end_str_tmp, ci.event_information_id, ci.session_id FROM " +
      "((event_information ei INNER JOIN calendar_information ci on ei.id = ci.event_information_id) INNER JOIN classes cl ON cl.event_information_id = ei.id)  WHERE ci.event_information_id = $1 AND ei.never_ending = true ORDER  BY start_str DESC LIMIT 1",
    values: [eventInformationId],
  };
  const res = await client.query(query);
  const rows = res.rows;

  if (rows.length == 0) {
    logger.debug("NO ROWS");
    return;
  }

  const lastDateStart = DateTime.fromISO(rows[0].startStrTmp);
  // calculate date 3 months before the last date in the database
  const dateThreeMonthsBefore = lastDateStart.set({ month: lastDateStart.month - 3 });
  if (DateTime.now() < dateThreeMonthsBefore) {
    logger.debug("Date of last event is still 3 months away");
    return;
  }

  const lastDateEnd = DateTime.fromISO(rows[0].endStrTmp);

  const rrule = RRule.fromString(rows[0].rrstring);
  const yearInAdvance = lastDateStart.set({ year: lastDateStart.year + 1 });
  // get next 20 dates
  const allDates = rrule.between(
    rrule.after(lastDateStart.toJSDate(), false),
    yearInAdvance.toJSDate(),
    false,
    (_, idx) => idx < 20
  );
  const intervals: Interval[] = [];

  for (const date of allDates) {
    const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const dateStart = DateTime.fromJSDate(dateWithoutTime)
      .set({
        hour: lastDateStart.hour,
        minute: lastDateStart.minute,
        second: lastDateStart.second,
      })
      .setZone(lastDateStart.zone, { keepLocalTime: true });

    const dateEnd = DateTime.fromJSDate(dateWithoutTime)
      .set({
        hour: lastDateEnd.hour,
        minute: lastDateEnd.minute,
        second: lastDateEnd.second,
      })
      .setZone(lastDateStart.zone, { keepLocalTime: true });

    intervals.push(Interval.fromDateTimes(dateStart, dateEnd));
  }

  const promises: Promise<void>[] = [];

  for (const interval of intervals) {
    promises.push(
      createCalendarEvent(rows[0].eventInformationId, interval.start.toISO(), interval.end.toISO())
    );
  }

  await Promise.all(promises);

  return;
};

const getClassesByUser = async (id: string): Promise<Class[]> => {
  const query = {
    text:
      "SELECT cl.min_level, cl.max_level, cl.rrstring, cl.start_time, cl.end_time, cl.language, cl.event_information_id, e.name " +
      "FROM ((event_information e INNER JOIN classes cl ON e.id = cl.event_information_id) " +
      "INNER JOIN commitments ON commitments.event_information_id = e.id) " +
      "WHERE commitments.user_id  = $1",
    values: [id],
  };
  const res = await client.query(query);
  let classesWithoutTeacher: TypeOf<typeof ClassWithoutTeacherInfoArraySchema>;
  try {
    classesWithoutTeacher = await decode(ClassWithoutTeacherInfoArraySchema, res.rows);
  } catch (e) {
    throw Error("Fields returned incorrectly from database");
  }

  const classesArray: Class[] = [];
  classesWithoutTeacher.forEach((singleClass) => {
    const currClass = {
      name: singleClass.name,
      eventInformationId: singleClass.eventInformationId,
      minLevel: singleClass.minLevel,
      maxLevel: singleClass.maxLevel,
      rrstring: singleClass.rrstring,
      startTime: singleClass.startTime,
      endTime: singleClass.endTime,
      language: singleClass.language,
      teachers: [],
    };
    classesArray.push(currClass);
  });
  return classesArray;
};

export { createClass, getClass, updateClass, getAllClasses, getClassesByUser, addDatesToUnlimitedClass };
