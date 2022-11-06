import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getAllStaff } from "../../../lib/database/staff";
import { StatusCodes } from "http-status-codes";
import { withAuth } from "../../../middleware/withAuth";
import {logger} from "../../../logger/logger";
import {logHttpRoute, onError} from "../../../lib/util/helpers";


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
  logHttpRoute(req);
  switch (req.method) {
    case "GET":
      try {
        const result = await getAllStaff();
        return res.status(StatusCodes.ACCEPTED).json(result);
      } catch (e) {
        onError(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }

    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default withAuth(staffHandler);
