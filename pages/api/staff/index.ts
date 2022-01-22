import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { findStaff } from "../../../lib/database/users";

export const staffHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "GET") {
    try {
      const result = await findStaff();
      res.status(200).json(result);
    } catch (e) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default staffHandler;
