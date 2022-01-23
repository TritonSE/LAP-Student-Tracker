import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { findStaff } from "../../../lib/database/users";

export const staffHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      try {
        const result = await findStaff();
        res.status(200).json(result);
      } catch (e) {
        res.status(500).json("Internal Server Error");
      }
      break;

    default:
      res.status(405).json("Method not allowed");
      break;
  }
};

export default staffHandler;
