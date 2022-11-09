import pino from 'pino';
import {NextApiRequest} from "next";

const levels = {
    http: 10,
    debug: 20,
    info: 30,
    warn: 40,
    error: 50,
    fatal: 60,
};


export const logger = pino({
    customLevels: levels,
    useOnlyCustomLevels: true,
    level: 'http',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
});

const onError = (e: unknown): void => {
    if (e instanceof Error) {
        logger.error("ERROR: " + e.message);
    } else {
        logger.error(e);
    }
};
const logHttpRoute = (req: NextApiRequest): void => {
    let logStr = req.method + ": " + req.url + "\n";

    if (req.method == "POST" || req.method == "PATCH") {
        logStr += "Body: " + JSON.stringify(req.body) + "\n";
    }

    logStr += "Query: " + JSON.stringify(req.query);
    logger.http(logStr);
};
export {logHttpRoute};
export {onError};