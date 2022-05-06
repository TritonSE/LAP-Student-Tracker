import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";
import {getEventFeed} from "../../../lib/database/calendar-events";
import {StatusCodes} from "http-status-codes";

// handles requests to /api/event-feed/
const eventFeedHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
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

        const result = await getEventFeed(start, end, userId);
        return res.status(StatusCodes.OK).json(result);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }

    default:
      res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
      break;
  }
};

export default eventFeedHandler;
