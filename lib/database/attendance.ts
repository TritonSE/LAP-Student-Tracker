import { client } from "../db";
import { array, TypeOf, Any } from "io-ts";
import { Attendance, AttendanceSchema, SingleUserAttendance, SingleUserAttendanceSchema, CreateAttendance, CreateAttendanceSchema, createAttendanceArrayType} from "../../models/attendance";
import { decode } from "io-ts-promise";

const AttendanceArraySchema = array(AttendanceSchema);
type attendanceArrayType = TypeOf<typeof AttendanceArraySchema>;

const SingleUserAttendanceArraySchema = array(SingleUserAttendanceSchema);
type singleUserAttendanceArrayType = TypeOf<typeof SingleUserAttendanceArraySchema>;

//get session_ids of events that occur before a given time: GET api/class/[id]/sessions
type sessionId= {
    session_id: string,
    start_str: string
}
const getSessions = async (
    time: string | null,
    classId: string,
): Promise<sessionId[]> => {
    let query;
    if (time){
        query = {
            text:
              "SELECT session_id, start_str "+ 
              "FROM calendar_information where end_str < $1 "+
              "WHERE event_information_id = $2",
            values: [time, classId],
          };
    }else{
        query = {
            text:
              "SELECT session_id, start_str " +
              "FROM calendar_information "+
              "WHERE event_information_id = $1",
            values: [classId],
        };
    }
    const res = await client.query(query);
    return res.rows;
};

//get attendance objects for given session id (GET: /api/class/[id]/attendence/[session_id])
const getAttendanceFromSessionID = async (
    session: string,
): Promise<Attendance[]> => {
    const query = {
        text: 
            "SELECT ua.session_id, ua.user_id, ua.first_name ,ua.last_name, ua.attendance FROM "+
            "( ( (select user_id, event_information_id, first_name, last_name from "+
            "(commitments left outer join users on commitments.user_id = users.id)) as c "+
            "inner join calendar_information as ci on c.event_information_id = ci.event_information_id) as c "+
            "left outer join attendance as a on "+
            "a.user_id = c.user_id and a.class_id = c.event_information_id and a.session_id = c.session_id) as ua "+
            "WHERE user_attendance.session_id = $1",
        values: [session],
    };
    const res = await client.query(query);
    let attendanceArray: attendanceArrayType;

    try {
        attendanceArray = await decode(AttendanceArraySchema, res.rows);
    } catch (e) {
        throw Error("Fields returned incorrectly in database");
    }

    return attendanceArray;
}

//get single user attendance array from class id (GET:/api/users/[id]/attendence/[class_id])
const getSingleUserAttendanceFromClassID = async (
    userId: string,
    classId: string,
): Promise<SingleUserAttendance[]> => {
    const query = {
        text: 
            "SELECT a.session_id, a.user_id, a.attendance, c.start_str " + 
            "FROM attendance a, calendar information c "+
            "WHERE a.class_id = $1 AND a.user_id = $2 AND a.session_id = c.session_id",
        values: [classId, userId],
    };

    const res = await client.query(query);
    let singleUserArray: singleUserAttendanceArrayType;

    try {
        singleUserArray = await decode(SingleUserAttendanceArraySchema, res.rows);
    }
    catch(e){
        throw Error("Error getting single user's attendance from database.");
    }
    return singleUserArray;
}

//add attendance of array os user_ids with attendance for a session id (POST:/api/class/[id]/attendence/[session_id])
const createAttendance = async (
    sessionId: string,
    classId: string,
    attendanceArray: createAttendanceArrayType,
): Promise<Attendance[]> => {
    for (var i = 0; i < attendanceArray.length; i++){

        const query = {
            text: 
                "INSERT INTO attendance (session_id, attendance, class_id, user_id) "+
                "VALUES ($1, $2, $3, $4) " +
                "ON CONFLICT (session_id, user_id, class_id) "+
                "UPDATE SET attendance = $2",
            values: [sessionId, attendanceArray[i].attendance, classId, attendanceArray[i].userId]
        };
        try {
            await client.query(query);
        } catch (e) {
            throw Error("Error on insert into database");
        };
    }
    return getAttendanceFromSessionID(sessionId);
}


export { getSessions, getAttendanceFromSessionID, getSingleUserAttendanceFromClassID, createAttendance };