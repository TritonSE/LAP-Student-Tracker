import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { createUser, getAllUsers } from "../../../lib/database/users";
import { UserSchema, User, Roles } from "../../../models/users";
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
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    }

    case "GET": {
      let role: Roles | undefined = undefined;
      if (req.query && req.query.role) role = req.query.role as Roles;
      try {
        let result = await getAllUsers();
        if (role) result = result.filter((user) => user.role == role);
        return res.status(StatusCodes.OK).json(result);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    }

    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default userHandler;
