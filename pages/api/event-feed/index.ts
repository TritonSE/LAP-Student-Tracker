import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getEventFeed } from "../../../lib/database/calendar-events";
import { StatusCodes } from "http-status-codes";
import {logHttpRoute, onError} from "../../../lib/util/helpers";

/**
 * @swagger
 * /api/event-feed:
 *  get:
 *    description: gets events for the calendar given the start and end date, and can be further filtered by user id
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
 *        required: false
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Getting all events
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/CalendarEvent'
 *
 * @param req
 * @param res
 */
const eventFeedHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      try {
        if (!req.query) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
        }

        const start = req.query.start as string;
        const end = req.query.end as string;
        const userId = req.query.userId as string;

        if (!start || !end) {
          return res.status(StatusCodes.BAD_REQUEST).json("No start or end date specified");
        }

        const result = await getEventFeed(start, end, userId);
        return res.status(StatusCodes.OK).json(result);
      } catch (e) {
        onError(e)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }

    default:
      res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
      break;
  }
};

export default eventFeedHandler;
