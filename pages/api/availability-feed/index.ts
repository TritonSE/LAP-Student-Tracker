import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { getAvailabilityFeed } from "../../../lib/database/availability-feed";

// handles requests to /api/availability-feed/
const availabilityFeedHandler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
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

        if (!userId) {
          return res.status(StatusCodes.BAD_REQUEST).json("No user specified");
        }

        const result = await getAvailabilityFeed(start, end, userId);
        return res.status(StatusCodes.OK).json(result);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
      }

    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default availabilityFeedHandler;
