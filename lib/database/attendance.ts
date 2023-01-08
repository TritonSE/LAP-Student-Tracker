import { client } from "../db";
import {
  Attendance,
  CreateAttendance,
  MissingAttendance,
  SessionInformation,
  SingleUserAttendance,
} from "../../models";
import { decode } from "io-ts-promise";
import { array } from "io-ts";
import { DateTime } from "luxon";

const AttendanceArraySchema = array(Attendance);
const SingleUserAttendanceArraySchema = array(SingleUserAttendance);
const MissingAttendanceArraySchema = array(MissingAttendance);
//get session_ids of events that occur before a given time: GET api/class/[id]/sessions
const getSessions = async (classId: string, time?: string): Promise<SessionInformation[]> => {
  let endTime = "";
  if (time) {
    const startTime = new Date(time);
    const endTimeDate = startTime.setDate(startTime.getDate() + 1);
    endTime = new Date(endTimeDate).toISOString();
  }
  const query = time
    ? {
        text:
          "SELECT session_id, start_str, end_str " +
          "FROM calendar_information WHERE start_str >= $1 " +
          "AND end_str <= $2 AND event_information_id = $3",
        values: [time, endTime, classId],
      }
    : {
        text:
          "SELECT session_id, start_str, end_str " +
          "FROM calendar_information " +
          "WHERE event_information_id = $1",
        values: [classId],
      };
  const res = await client.query(query);
  return res.rows;
};

//get attendance objects for given session id (GET: /api/class/[id]/attendence/[session_id])
const getAttendanceFromSessionID = async (
  session: string,
  classId: string
): Promise<Attendance[]> => {
  const query = {
    text:
      "select b.session_id, b.user_id, b.first_name, b.last_name, a.attendance  " +
      "from ( (select user_id, c.event_information_id, first_name, last_name, session_id from " +
      "( (select user_id, event_information_id, first_name, last_name from " +
      "(commitments as comm inner join (select * from users where role='Student') as u on comm.user_id = u.id)) as c " +
      "inner join calendar_information as ci on c.event_information_id = ci.event_information_id )) " +
      "as b left outer join attendance a on a.user_id = b.user_id and b.event_information_id = a.class_id " +
      "and a.session_id = b.session_id ) " +
      "where b.session_id = $1 and b.event_information_id = $2",
    values: [session, classId],
  };

  const res = await client.query(query);
  return await decode(AttendanceArraySchema, res.rows);
};

//get single user attendance array from class id (GET:/api/users/[id]/attendence/[class_id])
const getSingleUserAttendanceFromClassID = async (
  userId: string,
  classId: string
): Promise<SingleUserAttendance[]> => {
  const query = {
    text:
      "select b.session_id, b.user_id, a.attendance, TO_JSON(b.start_str) as start " +
      "from ( (select user_id, com.event_information_id, session_id, start_str " +
      "from (commitments as com inner join calendar_information as c " +
      "on com.event_information_id = c.event_information_id)) as b left outer join attendance " +
      "as a on b.user_id = a.user_id and b.event_information_id = a.class_id and a.session_id = b.session_id) " +
      "where b.event_information_id = $1 and b.user_id = $2",
    values: [classId, userId],
  };

  const res = await client.query(query);
  return await decode(SingleUserAttendanceArraySchema, res.rows);
};

//add attendance of array os user_ids with attendance for a session id (POST:/api/class/[id]/attendence/[session_id])
const createAttendance = async (
  sessionId: string,
  classId: string,
  attendanceArray: CreateAttendance[]
): Promise<Attendance[]> => {
  for (const createAttendanceObj of attendanceArray) {
    const query = {
      text:
        "insert into attendance (session_id, attendance, class_id, user_id) " +
        "values($1, $2, $3, $4) " +
        "on conflict (session_id, user_id) do update set attendance = $2",
      values: [sessionId, createAttendanceObj.attendance, classId, createAttendanceObj.userId],
    };
    await client.query(query);
  }

  const attendanceQuery = {
    text: "UPDATE calendar_information SET attendance_taken = true where session_id = $1",
    values: [sessionId],
  };

  await client.query(attendanceQuery);

  return getAttendanceFromSessionID(sessionId, classId);
};

const getAllSessionsWithoutAttendance = async (
  classId: string,
  until: DateTime
): Promise<MissingAttendance[]> => {
  const query = {
    text: "SELECT session_id, TO_JSON(start_str) AS start_str FROM calendar_information WHERE attendance_taken = FALSE AND event_information_id = $1 AND start_str <= $2",
    values: [classId, until.toISO()],
  };

  const res = await client.query(query);
  return await decode(MissingAttendanceArraySchema, res.rows);
};

export {
  getSessions,
  getAttendanceFromSessionID,
  getSingleUserAttendanceFromClassID,
  createAttendance,
  getAllSessionsWithoutAttendance,
};
