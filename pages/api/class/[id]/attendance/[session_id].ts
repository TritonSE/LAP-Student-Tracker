import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import {
  getAttendanceFromSessionID,
  createAttendance,
} from "../../../../../lib/database/attendance";
import {
  CreateAttendanceArraySchema,
  createAttendanceArrayType,
} from "../../../../../models/attendance";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";

// handles requests to /api/class/[id]/attendance/[session_id]
export const sessionIDHandler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!req.query) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
  }

  const classId = req.query.id as string;
  const sessionId = req.query.session_id as string;

  if (!classId) {
    return res.status(400).json("no class id specified");
  }
  if (!sessionId) {
    return res.status(400).json("no session id specified");
  }

  switch (req.method) {
    case "GET": {
      try {
        const attendanceArray = await getAttendanceFromSessionID(sessionId, classId);
        return res.status(StatusCodes.ACCEPTED).json(attendanceArray);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    }

    case "POST": {
      let newAttendance: createAttendanceArrayType;
      try {
        newAttendance = await decode(CreateAttendanceArraySchema, req.body);
      } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {
        const result = await createAttendance(sessionId, classId, newAttendance);
        return res.status(StatusCodes.CREATED).json(result);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    }

    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default sessionIDHandler;
