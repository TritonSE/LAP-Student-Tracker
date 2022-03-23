import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getEventFeed } from "../../../lib/database/calendar-events";
import { StatusCodes } from "http-status-codes";
import { getAvailibilityFeed } from "../../../lib/database/availibility-feed";

// handles requests to /api/event-feed/
const availibilityFeedHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
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

        const result = await getAvailibilityFeed(start, end, userId);
        res.status(StatusCodes.OK).json(result);
      } catch (e) {
        console.log(e)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
      break;

    default:
      res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
      break;
  }
};

export default availibilityFeedHandler;
