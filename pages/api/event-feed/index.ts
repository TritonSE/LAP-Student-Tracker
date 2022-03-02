import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getEventFeed } from "../../../lib/database/calendar";
import { StatusCodes } from "http-status-codes";

// handles requests to /api/event-feed/
const eventFeedHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      try {
        if (!req.body.start || !req.body.end) {
          return res.status(StatusCodes.BAD_REQUEST).json("Missing required parameters");
        }

        const result = await getEventFeed(req.body.start, req.body.end, req.body.userId);
        res.status(StatusCodes.OK).json(result);
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
