import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { deleteCommitment } from "../../../../../../lib/database/commitments";
import { StatusCodes } from "http-status-codes";
import { withAuth } from "../../../../../../middleware/withAuth";
import { withLogging } from "../../../../../../middleware/withLogging";

/**
 * @swagger
 * /api/class/{id}/student/{student_id}:
 *  delete:
 *   description: Delete an student from a class
 *   parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *      - in: path
 *        name: student_id
 *        required: true
 *        schema:
 *          type: string
 *   responses:
 *      202:
 *        description: Delete student from class successfully
 */

export const classStudentIdHandler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!req.query) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
  }
  const classId = req.query.id as string;
  const studentId = req.query.student_id as string;

  if (!classId) {
    return res.status(400).json("no class id specified");
  }
  if (!studentId) {
    return res.status(400).json("no student id specified");
  }

  switch (req.method) {
    case "DELETE":
      try {
        const result = await deleteCommitment(studentId, classId);
        return res.status(StatusCodes.ACCEPTED).json(result);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }

    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default withLogging(withAuth(classStudentIdHandler));
