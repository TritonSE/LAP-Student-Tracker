import {logger} from "../../logger/logger";
import {NextApiRequest} from "next";

const onError = (e: unknown): void => {
    if (e instanceof Error) {
        logger.error("ERROR: " + e.message);
    } else {
        logger.error(e);
    }
};

const logHttpRoute = (req:NextApiRequest): void => {
    let logStr = req.method + ": " + req.url + "\n";

    if (req.method == "POST" || req.method == "PATCH") {
        logStr += "Body: " + JSON.stringify(req.body) + "\n";
    }

    logStr += "Query: " + JSON.stringify(req.query);
    logger.http(logStr);
};

export { onError, logHttpRoute };