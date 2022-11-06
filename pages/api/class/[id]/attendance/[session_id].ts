import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import {
  getAttendanceFromSessionID,
  createAttendance,
} from "../../../../../lib/database/attendance";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";
import { CreateAttendance } from "../../../../../models";
import { array } from "io-ts";
import {logHttpRoute, onError} from "../../../../../lib/util/helpers";
const CreateAttendanceArraySchema = array(CreateAttendance);
/**
 * @swagger
 * /api/class/{id}/attendance/{sessionId}:
 *  get:
 *    description: Get the attendance records for all students within this session for this class
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *      - in: path
 *        name: sessionId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Found all attendance records
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/components/schemas/Attendance'
 *  post:
 *    description: Add attendance records for multiple students in this session. Will overwrite or create attendance records for each student
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *      - in: path
 *        name: sessionId
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      description: Array of attendance objects for attendance
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              type: object
 *              $ref: '#/components/schemas/CreateAttendance'
 *    responses:
 *      201:
 *        description: Attendance created/updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/components/schemas/Attendance'
 */
export const sessionIDHandler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {

  logHttpRoute(req)
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
        onError(e)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    }

    case "POST": {
      let newAttendance: CreateAttendance[];
      try {
        newAttendance = await decode(CreateAttendanceArraySchema, req.body);
      } catch (e) {
        onError(e)
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {
        const result = await createAttendance(sessionId, classId, newAttendance);
        return res.status(StatusCodes.CREATED).json(result);
      } catch (e) {
        onError(e)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    }

    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default sessionIDHandler;
