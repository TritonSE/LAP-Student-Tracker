import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getEventFeed} from "../../../lib/database/calendar";
import { StatusCodes } from "http-status-codes";
import { decode } from "io-ts-promise";
import { rrulestr } from "rrule";
import { DateTime } from "luxon";
import { string } from "fp-ts";

type getEventFeedParams = {
  start: string,
  end: string,
  userId?: string,
}

// handles requests to /api/event-feed/
const eventFeedHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      /*let eventFeed*/
      try {
        /*newUser = await decode(getEventFeedParams, req.body);*/
        const result = await getEventFeed(req.body.start, req.body.end, req.body.userId);
        res.status(StatusCodes.ACCEPTED).json(result);
        console.log(result);
      } catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
      break;

    default:
      res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
      break;
  }
};

export default eventFeedHandler;