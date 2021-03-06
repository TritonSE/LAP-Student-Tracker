import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { getSessions } from "../../../../lib/database/attendance";

export const sessionHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
  }

  const id = req.query.id as string;
  const until = req.query.until as string;
  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json("No id specified");
  }

  if (req.method == "GET") {
    try {
      const sessions = await getSessions(id, until);
      return res.status(StatusCodes.ACCEPTED).json(sessions);
    } catch (e) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
    }
  } else {
    return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default sessionHandler;
