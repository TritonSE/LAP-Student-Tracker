import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { getClassesByUser } from "../../../../../lib/database/classes";
import { withLogging } from "../../../../../middleware/withLogging";
import { logData, onError } from "../../../../../logger/logger";

/**
 * @swagger
 * /api/users/{id}/classes:
 *  get:
 *    description: Get all classes for a single user
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      202:
 *        description: Found user's classes
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                  type: object
 *                  $ref: '#/components/schemas/Class'
 */

export const userClassesHandler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!req.query) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
  }

  const userId = req.query.id as string;
  if (!userId) {
    return res.status(StatusCodes.BAD_REQUEST).json("No id specified");
  }

  switch (req.method) {
    case "GET":
      try {
        const result = await getClassesByUser(userId);
        logData("Classes of one user: ", result);
        return res.status(StatusCodes.ACCEPTED).json(result);
      } catch (e) {
        onError(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }

    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default withLogging(userClassesHandler);
