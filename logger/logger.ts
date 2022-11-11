import pino from "pino";
import { NextApiRequest } from "next";

const levels = {
  http: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

type LogData = {
  type: string;
  data: Record<never, never> | null;
};

type LogHttp = {
  method: string | undefined;
  url: string | undefined;
  query: Record<never, never>;
  body: Record<never, never>;
};

export const logger = pino({
  customLevels: levels,
  useOnlyCustomLevels: true,
  level: "http",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

const onError = (e: unknown): void => {
  if (e instanceof Error) {
    logger.error("ERROR: " + e.message);
  } else {
    logger.error(e);
  }
};
const logHttpRoute = (req: NextApiRequest): void => {
  const logHttp: LogHttp = {
    method: req.method,
    body: req.body,
    query: req.query,
    url: req.url,
  };
  logger.http(logHttp);
};

const logData = (title: string, data: Record<never, never> | null): void => {
  const logData: LogData = {
    type: title,
    data: data,
  };
  logger.debug(logData);
};

export { logHttpRoute, onError, logData };
