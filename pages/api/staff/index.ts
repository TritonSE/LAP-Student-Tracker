import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getAllStaff } from "../../../lib/database/staff";
import { StatusCodes } from "http-status-codes";
import { withAuth } from "../../../middleware/withAuth";
// handles requests to /api/staff/
const staffHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      try {
        const result = await getAllStaff();
        return res.status(StatusCodes.ACCEPTED).json(result);
      } catch (e) {
        console.log(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }

    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default withAuth(staffHandler);
