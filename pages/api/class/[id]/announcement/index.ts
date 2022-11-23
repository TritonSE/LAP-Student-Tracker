import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getAnnouncements, createAnnouncement } from "../../../../../lib/database/announcements";
import { CreateAnnouncement } from "../../../../../models";
import { getClass } from "../../../../../lib/database/classes";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";
import { withAuth } from "../../../../../middleware/withAuth";
import { withLogging } from "../../../../../middleware/withLogging";

//Handles all requests to /api/class/[id]/announcement
/**
 * @swagger
 * /api/class/[id]/announcement:
 *  get:
 *    description: get a list of all announcements in a class
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Successfully getting all announcements
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/components/schemas/Announcement'
 *  post:
 *    description: Create an announcement in a class
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      description: Data for the announcement that needs to be created
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/CreateAnnouncement'
 *    responses:
 *      201:
 *        description: Successfully created the announcement
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Announcement'
 */

export const announcementHandler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!req.query) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
  }
  const classId = req.query.id as string;
  let newAnnouncement: CreateAnnouncement;
  if (!classId) {
    return res.status(StatusCodes.BAD_REQUEST).json("no class id specified");
  }
  const classObj = await getClass(classId);
  if (classObj == null) {
    return res.status(StatusCodes.NOT_FOUND).json("class not found");
  }

  switch (req.method) {
    case "GET":
      try {
        const announcements = await getAnnouncements(classId);
        return res.status(StatusCodes.ACCEPTED).json(announcements);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    case "POST":
      try {
        newAnnouncement = await decode(CreateAnnouncement, req.body);
      } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {
        const result = await createAnnouncement(
          classId,
          newAnnouncement.title,
          newAnnouncement.content
        );
        return res.status(StatusCodes.CREATED).json(result);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default withLogging(withAuth(announcementHandler));
