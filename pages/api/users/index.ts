import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { createUser } from "../../../lib/database/users";
import { userSchema } from "../../../models/users";
import { StatusCodes } from "http-status-codes";

export const userHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      let newUser;
      try {
        newUser = await userSchema.validate(req.body);
      } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {
        const result = await createUser(
          newUser.id,
          newUser.first_name,
          newUser.last_name,
          newUser.email,
          newUser.role,
          newUser.address,
          newUser.phone_number
        );
        return res.status(StatusCodes.CREATED).json(result);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }

    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default userHandler;
