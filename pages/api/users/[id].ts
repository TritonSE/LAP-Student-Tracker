import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { updateUser } from "../../../lib/database/users";
import { userSchema } from "../../../models/users";
import { findUser } from "../../../lib/database/users";
import { StatusCodes } from "http-status-codes";

/**
 * This handles a POST request to /api/users. In Next.js, the file names are what
 * denotes the route. Read more about requests within Next here:
 * https://nextjs.org/docs/api-routes/response-helpers
 *
 */
export const userIDHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.query == undefined) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
  }

  const id = req.query.id as string;

  if (!id) {
    return res.status(400).json("no id specified");
  }

  switch (req.method) {
    case "GET":
      try {
        const user = await findUser(id);
        if (user == null) {
          return res.status(StatusCodes.NOT_FOUND).json("user not found");
        }
        return res.status(StatusCodes.ACCEPTED).json(user);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }

    case "PATCH":
      let newUser;
      try {
        newUser = await userSchema.validate(req.body);
      } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {
        // call the function that actually inserts the data into the database
        const result = await updateUser(
          id,
          newUser.first_name,
          newUser.last_name,
          newUser.email,
          newUser.role,
          newUser.address,
          newUser.phone_number
        );
        return res.status(StatusCodes.CREATED).json(result);
      } catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }

    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default userIDHandler;
