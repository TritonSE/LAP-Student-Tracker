import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { getSingleUserAttendanceFromSessionID } from "../../../../../../lib/database/attendance";
import { withLogging } from "../../../../../../middleware/withLogging";
import { logData, onError } from "../../../../../../logger/logger";

/**
 * @swagger
 * /api/users/{id}/attendance/{classId}/{sessionId}:
 *  get:
 *    description: Get single user's attendance
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
 *      202:
 *        description: Found attendance record
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/SingleUserAttendance'
 *
 */
export const userAttendanceHandler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!req.query) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
  }

  const userId = req.query.id as string;
  const classId = req.query.class_id as string;
  const sessionId = req.query.session_id as string;

  if (!userId) {
    return res.status(StatusCodes.BAD_REQUEST).json("No id specified");
  }
  if (!classId) {
    return res.status(StatusCodes.BAD_REQUEST).json("No clas id specified");
  }
  if (!sessionId) {
    return res.status(StatusCodes.BAD_REQUEST).json("No session id specified");
  }

  if (req.method == "GET") {
    try {
      const attendance = await getSingleUserAttendanceFromSessionID(userId, classId, sessionId);
      logData("AttendanceComponent for One User", attendance);
      return res.status(StatusCodes.ACCEPTED).json(attendance);
    } catch (e) {
      onError(e);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
    }
  } else {
    return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default withLogging(userAttendanceHandler);
