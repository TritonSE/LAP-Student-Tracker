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
    if (req.method == "POST") {
        logger.http(req.method + ": " + req.url + " with body: " + req.body)
    }
    else {
        logger.http(req.method + ": " + req.url);
    }
};

export { onError, logHttpRoute };