import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getStaff } from "../../../lib/database/users";
import { StatusCodes } from "http-status-codes";

// handles requests to /api/staff/
export const staffHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      try {
        const result = await getStaff();
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
