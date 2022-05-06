import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";
import {getAllStaff} from "../../../lib/database/staff";
import {StatusCodes} from "http-status-codes";

// handles requests to /api/staff/
const staffHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      try {
        const result = await getAllStaff();
        res.status(StatusCodes.ACCEPTED).json(result);
      } catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
      break;

    default:
      res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
      break;
  }
};

export default staffHandler;
