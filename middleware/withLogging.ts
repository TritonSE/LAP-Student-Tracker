import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { logHttpRoute } from "../logger/logger";

const withLogging = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<unknown> => {
    logHttpRoute(req);
    return handler(req, res);
  };
};

export { withLogging };
