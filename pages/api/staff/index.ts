import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getAllStaff } from "../../../lib/database/staff";
import { StatusCodes } from "http-status-codes";
import { withAuth } from "../../../middleware/withAuth";
import { logData, onError } from "../../../logger/logger";
import { withLogging } from "../../../middleware/withLogging";

/**
 * @swagger
 * /api/staff:
 *  get:
 *    description: Get all staff
 *    responses:
 *      202:
 *        description: Returning staff succesfully
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/components/schemas/Staff'
 * @param req
 * @param res
 */
const staffHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      try {
        const result = await getAllStaff();
        logData("All Staff", result);
        return res.status(StatusCodes.ACCEPTED).json(result);
      } catch (e) {
        onError(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }

    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default withLogging(withAuth(staffHandler));
