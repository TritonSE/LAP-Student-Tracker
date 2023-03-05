import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { deleteEvent } from "../../../../../lib/database/events";
import { StatusCodes } from "http-status-codes";
import { withLogging } from "../../../../../middleware/withLogging";
import { logData, onError } from "../../../../../logger/logger";

// Handles all requests to /api/events/class/{id}
export const classEventHandler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!req.query) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
  }

  const eventId = req.query.id as string;
  if (!eventId) {
    return res.status(StatusCodes.BAD_REQUEST).json("no event id specified");
  }

  switch (req.method) {
    case "DELETE": {
      try {
        const result = await deleteEvent(eventId);
        logData("Deleted class", result);
        return res.status(StatusCodes.ACCEPTED).json(result);
      } catch (e) {
        onError(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    }

    default: {
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
    }
  }
};

export default withLogging(classEventHandler);
