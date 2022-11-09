import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { getRoster } from "../../../../../lib/database/roster";
import { getClass } from "../../../../../lib/database/classes";
import {withLogging} from "../../../../../middleware/withLogging";
import {logHttpRoute, onError} from "../../../../../logger/logger";

const classRosterHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
  }

  const classId = req.query.id as string;

  if (!classId) {
    return res.status(StatusCodes.BAD_REQUEST).json("No class id specified");
  }

  switch (req.method) {
    case "GET": {
      try {
        const classObj = await getClass(classId);
        if (classObj == null) {
          return res.status(StatusCodes.NOT_FOUND).json("Class not found");
        }

        const roster = await getRoster(classId);
        return res.status(StatusCodes.ACCEPTED).json(roster);
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

export default withLogging(classRosterHandler);
