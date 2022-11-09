import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { getAvailabilityFeed } from "../../../lib/database/availability-feed";
import {logHttpRoute, onError} from "../../../logger/logger";

/**
 * @swagger
 * /api/availability-feed:
 *  get:
 *    description: Get calendar events for a certain user's availability. Is used by the React Calendar
 *    parameters:
 *      - in: query
 *        name: start
 *        required: true
 *        schema:
 *          type: string
 *      - in: query
 *        name: end
 *        required: true
 *        schema:
 *          type: string
 *      - in: query
 *        name: userId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Events found successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/components/schemas/CalendarEvent'
 *
 * @param req
 * @param res
 */
const availabilityFeedHandler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case "GET":
      try {
        if (!req.query) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
        }

        const start = req.query.start as string;
        const end = req.query.end as string;
        const userId = req.query.userId as string;

        if (!start || !end) {
          return res.status(StatusCodes.BAD_REQUEST).json("No start or end date specified");
        }

        if (!userId) {
          return res.status(StatusCodes.BAD_REQUEST).json("No user specified");
        }

        const result = await getAvailabilityFeed(start, end, userId);
        return res.status(StatusCodes.OK).json(result);
      } catch (e) {
        onError(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }

    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default availabilityFeedHandler;
