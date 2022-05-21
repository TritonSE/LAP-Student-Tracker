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
    sessionId: string,
    startStr: string
}
const getSessions = async (
    classId: string,
    time?: string
): Promise<sessionId[]> => {
    let query;
    if (time){
        query = {
            text:
              "SELECT session_id, start_str "+ 
              "FROM calendar_information WHERE end_str < $1 "+
              "AND event_information_id = $2",
            values: [time, classId],
          };
    } else{
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
    classId: string
): Promise<Attendance[]> => {
    const query = {
        text: 
            "select b.session_id, b.user_id, b.first_name, b.last_name, a.attendance  "+
            "from ( (select user_id, c.event_information_id, first_name, last_name, session_id from "+
            "( (select user_id, event_information_id, first_name, last_name from "+
            "(commitments as comm left outer join users as u on comm.user_id = u.id)) as c "+
            "inner join calendar_information as ci on c.event_information_id = ci.event_information_id )) "+
            "as b left outer join attendance a on a.user_id = b.user_id and b.event_information_id = a.class_id "+
            "and a.session_id = b.session_id ) "+
            "where b.session_id = $1 and b.event_information_id = $2",
        values: [session, classId],
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
            "select a.session_id, a.user_id, a.attendance, c.start_str AS start "+
            "from attendance as a, calendar_information as c "+
            "where a.session_id = c.session_id and a.class_id = c.event_information_id "+
            "and a.user_id = $1 and a.class_id = $2",
        values: [userId, classId],
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
    attendanceArray: CreateAttendance[],
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
    return getAttendanceFromSessionID(sessionId, classId);
}


export { getSessions, getAttendanceFromSessionID, getSingleUserAttendanceFromClassID, createAttendance };