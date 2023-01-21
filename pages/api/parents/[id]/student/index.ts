import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { withAuth } from "../../../../../middleware/withAuth";
import { onError } from "../../../../../logger/logger";
import { withLogging } from "../../../../../middleware/withLogging";
import {
  getAllStudentsWithAParent,
  linkParentAndStudent,
} from "../../../../../lib/database/parents";
import { CreateParentStudentLink, ParentStudentLink } from "../../../../../models";
import { decode } from "io-ts-promise";
import { getUserByEmail } from "../../../../../lib/database/users";

/**
 * @swagger
 * /api/parents/[id]/student:
 *  post:
 *    description: Adds a parent and student relationship to the database
 *    responses:
 *      200:
 *        description: Parent and student successfully linked
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/ParentStudentLink'
 * @param req
 * @param res
 */
const parentStudentHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  let createParentStudentLink: CreateParentStudentLink;
  switch (req.method) {
    case "POST":
      try {
        createParentStudentLink = await decode(CreateParentStudentLink, req.body);
      } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {
        const parentId = req.query.id as string;
        if (!parentId) {
          return res.status(StatusCodes.BAD_REQUEST).json("Parent id not specified");
        }
        const studentEmail = createParentStudentLink.email;
        const student = await getUserByEmail(studentEmail);
        if (!student || student.role !== "Student") {
          return res.status(StatusCodes.NOT_FOUND).json("Student not found");
        }
        await linkParentAndStudent(parentId, student.id);
        const parentStudentLink: ParentStudentLink = {
          parentId: parentId,
          studentId: student.id,
        };
        return res.status(StatusCodes.OK).json(parentStudentLink);
      } catch (e) {
        onError(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    case "GET":
      try {
        const parentId = req.query.id as string;
        if (!parentId) {
          return res.status(StatusCodes.BAD_REQUEST).json("Parent id not specified");
        }
        const studentsLinked = await getAllStudentsWithAParent(parentId);
        return res.status(StatusCodes.OK).json(studentsLinked);
      } catch (e) {
        onError(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default withLogging(withAuth(parentStudentHandler));
