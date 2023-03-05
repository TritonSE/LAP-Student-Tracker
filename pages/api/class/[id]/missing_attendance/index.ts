import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { DateTime } from "luxon";
import { getAllSessionsWithoutAttendance } from "../../../../../lib/database/attendance";
import { onError } from "../../../../../logger/logger";
import { withLogging } from "../../../../../middleware/withLogging";

const missingAttendanceHandler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const classId = req.query.id as string;
  const currentDate = DateTime.local();
  switch (req.method) {
    case "GET": {
      try {
        const missingAttendance = await getAllSessionsWithoutAttendance(classId, currentDate);
        return res.status(StatusCodes.OK).json(missingAttendance);
      } catch (e) {
        onError(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    }

    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default withLogging(missingAttendanceHandler);
