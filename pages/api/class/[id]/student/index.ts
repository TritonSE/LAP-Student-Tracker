import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { createCommitment } from "../../../../../lib/database/commitments";
import { getClass } from "../../../../../lib/database/classes";
import { getUser } from "../../../../../lib/database/users";
import { StatusCodes } from "http-status-codes";
import { withAuth } from "../../../../../middleware/withAuth";
import { withLogging } from "../../../../../middleware/withLogging";

//Handles all requests to /api/class/[id]/student
/**
 * @swagger
 *  post:
 *    description: Add a student to a class
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      description: ID of student to add
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: string
 *    responses:
 *      201:
 *        description: Successfully added student to class
 */

export const classStudentHandler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!req.query) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
  }
  const classId = req.query.id as string;
  if (!classId) {
    return res.status(StatusCodes.BAD_REQUEST).json("no class id specified");
  }
  const classObj = await getClass(classId);
  if (classObj == null) {
    return res.status(StatusCodes.NOT_FOUND).json("class not found");
  }

  switch (req.method) {
    case "POST": {
      const studentId = req.body.studentId as string;
      if (!studentId) {
        return res.status(StatusCodes.BAD_REQUEST).json("no student id specified");
      }
      const userObj = await getUser(studentId);
      if (userObj == null || (userObj.role as string) != "Student") {
        return res.status(StatusCodes.NOT_FOUND).json("student not found");
      }
      try {
        const result = await createCommitment(studentId, classId);
        return res.status(StatusCodes.CREATED).json(result);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    }
    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};
export default withLogging(withAuth(classStudentHandler));
