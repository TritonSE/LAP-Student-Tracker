import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { createUser, createStaffUser } from "../../../lib/database/users";
import { UserSchema, User } from "../../../models/users";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";

// handles requests to /api/users/
const userHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST": {
      let newUser: User;
      try {
        newUser = await decode(UserSchema, req.body);
      } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {
        if(newUser.role == "Teacher" || newUser.role == "Admin") {
          const result = await createStaffUser(
            newUser.id,
            newUser.firstName,
            newUser.lastName,
            newUser.email,
            newUser.role,
            newUser.address,
            newUser.phoneNumber,
          );
          return res.status(StatusCodes.CREATED).json(result);
        } else {
          const result = await createUser(
            newUser.id,
            newUser.firstName,
            newUser.lastName,
            newUser.email,
            newUser.role,
            newUser.address,
            newUser.phoneNumber
          );
          return res.status(StatusCodes.CREATED).json(result);
        }
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    }

    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default userHandler;
