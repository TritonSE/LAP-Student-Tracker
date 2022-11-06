import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import {logHttpRoute} from "../lib/util/helpers";

const withLogging = (handler: NextApiHandler) => {
    return async (req: NextApiRequest, res: NextApiResponse): Promise<unknown> => {
        logHttpRoute(req)
        return handler(req, res)

    }
}

export { withLogging }