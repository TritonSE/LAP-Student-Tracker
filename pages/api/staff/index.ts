import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getAllStaff } from "../../../lib/database/staff";
import { StatusCodes } from "http-status-codes";
import { withAuth } from "../../../middleware/withAuth";
import {logger} from "../../../logger/logger";


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
      logger.http("GET /api/staff requested");
      try {
        const result = await getAllStaff();
        logger.info("Requested all staff");
        return res.status(StatusCodes.ACCEPTED).json(result);
      } catch (e) {
        if (e instanceof Error) {
          logger.error(e.message);
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }

    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default withAuth(staffHandler);
