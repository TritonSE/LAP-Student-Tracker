import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { addDatesToUnlimitedClass } from "../../../../../lib/database/classes";
import { onError } from "../../../../../logger/logger";
import { withAuth } from "../../../../../middleware/withAuth";
import { withLogging } from "../../../../../middleware/withLogging";

const refreshClassHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "PATCH": {
      if (!req.query) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Request query not specified");
      }
      const id = req.query.id as string;

      try {
        await addDatesToUnlimitedClass(id);
        return res.status(StatusCodes.OK).json("Ok");
      } catch (e) {
        onError(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    }
  }
};

export default withLogging(withAuth(refreshClassHandler));
