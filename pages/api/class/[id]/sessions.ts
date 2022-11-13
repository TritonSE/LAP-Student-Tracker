import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { getSessions } from "../../../../lib/database/attendance";

/**
 * @swagger
 * /api/class/{id}/session:
 *  get:
 *    description: Get all the session ids and the time the session starts based on class id
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      201:
 *        description: Returning all sessionsId's successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  startStr:
 *                    type: string
 *                    description: The ISO string when this session starts
 *                  sessionId:
 *                    type: string
 *                    description: The session id (determined when creating the event by postgres)
 */
export const sessionHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
  }

  const id = req.query.id as string;
  const date = req.query.date as string;
  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json("No id specified");
  }

  if (req.method == "GET") {
    try {
      const sessions = await getSessions(id, date);
      return res.status(StatusCodes.ACCEPTED).json(sessions);
    } catch (e) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
    }
  } else {
    return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default sessionHandler;
