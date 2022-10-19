import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getAllStudents } from "../../../lib/database/students";
import { StatusCodes } from "http-status-codes";
import { withAuth } from "../../../middleware/withAuth";

/**
 * @swagger
 * /api/students:
 *  get:
 *    description: Get all students
 *    responses:
 *      202:
 *        description: Returning students succesfully
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/components/schemas/Student'
 * @param req
 * @param res
 */
const studentsHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      try {
        const result = await getAllStudents();
        return res.status(StatusCodes.ACCEPTED).json(result);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }

    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default withAuth(studentsHandler);
