import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { UpdateUser } from "../../../../models";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";
import { withAuth } from "../../../../middleware/withAuth";
import { getUser, updateUser, deleteUser } from "../../../../lib/database/users";
import {withLogging} from "../../../../middleware/withLogging";

/**
 * @swagger
 * /api/users/{id}:
 *  get:
 *   description: Get a user by id
 *   parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *   responses:
 *      200:
 *        description: Found user
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/User'
 *  patch:
 *   description: Edit a user's details
 *   parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *   requestBody:
 *    description: The new data for the user
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          type: object
 *          $ref: '#/components/schemas/UpdateUser'
 *   responses:
 *    201:
 *      description: Updated user successfully
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/User'
 *  delete:
 *   description: Delete a user from the database
 *   parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *   responses:
 *      202:
 *        description: Delete user successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/User'
 */
const userIDHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
  }

  const id = req.query.id as string;

  if (!id) {
    return res.status(400).json("no id specified");
  }

  switch (req.method) {
    case "GET": {
      try {
        const user = await getUser(id);
        if (user == null) {
          return res.status(StatusCodes.NOT_FOUND).json("user not found");
        }
        return res.status(StatusCodes.ACCEPTED).json(user);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
      }
    }

    case "PATCH": {
      const user = await getUser(id);
      if (user == null) {
        return res.status(StatusCodes.NOT_FOUND).json("user not found");
      }
      let newUser: UpdateUser;
      try {
        newUser = await decode(UpdateUser, req.body);
      } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {
        // call the function that actually inserts the data into the database
        const result = await updateUser(
          id,
          newUser.firstName,
          newUser.lastName,
          newUser.email,
          newUser.role,
          newUser.approved,
          newUser.address,
          newUser.phoneNumber
        );
        return res.status(StatusCodes.CREATED).json(result);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
      }
    }

    case "DELETE": {
      try {
        const result = await deleteUser(id);
        return res.status(StatusCodes.ACCEPTED).json(result);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    }

    default: {
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
    }
  }
};

export default withLogging(withAuth(userIDHandler));
