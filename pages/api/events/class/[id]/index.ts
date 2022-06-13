import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { deleteClassEvent } from "../../../../../lib/database/events";

import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";

// Handles all requests to /api/events/class/{id}
export const classEventHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
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
        const result = await deleteClassEvent(eventId);
        return res.status(StatusCodes.ACCEPTED).json(result);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
      }
    }

    default: {
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
    }
  }
};

export default classEventHandler;
