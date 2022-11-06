import { createUser, getAllUsers } from "../../../lib/database/users";
import { createImage } from "../../../lib/database/images";
import { Roles } from "../../../models";
import { CreateUser } from "../../../models";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import {logger} from "../../../logger/logger";

/**
 * @swagger
 * /api/users:
 *  get:
 *    description: Returns all users
 *    parameters:
 *      - in: query
 *        name: role
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Returned successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/components/schemas/User'
 *  post:
 *    description: Add a new user
 *    requestBody:
 *      description: User to be created
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/CreateUser'
 *    responses:
 *      201:
 *        description: Successfully created a new user
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/User'
 *
 */
const userHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST": {
      logger.http("POST /api/users requested with the following body: " + req.body);
      let newUser: CreateUser;
      try {
        newUser = await decode(CreateUser, req.body);
      } catch (e) {
        err
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {
        const imgId = await createImage();
        const result = await createUser(
          newUser.id,
          newUser.firstName,
          newUser.lastName,
          newUser.email,
          newUser.role,
          imgId
        );
        return res.status(StatusCodes.CREATED).json(result);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
      }
    }

    case "GET": {
      let role: Roles | undefined = undefined;
      if (req.query) {
        if (req.query.role) {
          if (
            ["Admin", "Teacher", "Parent", "Volunteer", "Student"].includes(
              req.query.role as string
            )
          )
            role = req.query.role as Roles;
          else
            return res
              .status(StatusCodes.BAD_REQUEST)
              .json("Query parameter refers to role that does not exist");
        }
      }
      const approvalStatus = !req.query.approved ? undefined : req.query.approved == "true";
      try {
        let result = await getAllUsers();
        if (role) result = result.filter((user) => user.role == role);
        if (approvalStatus != undefined)
          result = result.filter((user) => user.approved == approvalStatus);
        return res.status(StatusCodes.OK).json(result);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
      }
    }

    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default userHandler;
