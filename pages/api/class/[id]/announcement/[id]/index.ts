import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { deleteAnnouncement } from "../../../../../../lib/database/announcements";
import { StatusCodes } from "http-status-codes";
import { withAuth } from "../../../../../../middleware/withAuth";

/**
 * @swagger
 * /api/class/{classId}/announcement/{id}:
 *  delete:
 *   description: Delete an announcement from the database
 *   parameters:
 *      - in: path
 *        name: classId
 *        required: true
 *        schema:
 *          type: string
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *   responses:
 *      202:
 *        description: Delete announcement successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Announcement'
 */

export const announcementIdHandler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!req.query) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
  }
  const classId = req.query.class_id as string;
  const id = req.query.id as string;

  if (!classId) {
    return res.status(400).json("no class id specified");
  }
  if (!id) {
    return res.status(400).json("no announcement id specified");
  }

  switch (req.method) {
    case "DELETE":
      try {
        const result = await deleteAnnouncement(classId, id);
        return res.status(StatusCodes.ACCEPTED).json(result);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }

    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default withAuth(announcementIdHandler);
