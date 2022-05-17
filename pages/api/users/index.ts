import { createUser, getAllUsers } from "../../../lib/database/users";
import { createImage } from "../../../lib/database/images";
import { Roles, CreateUser, CreateUserSchema } from "../../../models/users";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

// handles requests to /api/users/
const userHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST": {
      let newUser: CreateUser;
      try {
        newUser = await decode(CreateUserSchema, req.body);
      } catch (e) {
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
          newUser.address,
          newUser.phoneNumber,
          imgId
        );
        return res.status(StatusCodes.CREATED).json(result);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    }

    case "GET": {
      let role: Roles | undefined = undefined;
      let onlyUnapproved: boolean = false;
      if (req.query) {
        if (req.query.role) {
          if (
            ["Admin", "Teacher", "Parent", "Volunteer", "Student"].includes(req.query.role as string)
          )
            role = req.query.role as Roles;
          else
            return res
              .status(StatusCodes.BAD_REQUEST)
              .json("Query parameter refers to role that does not exist");
        }
        if (req.query.onlyUnapproved) {
          onlyUnapproved = true;
        }
      }
      try {
        let result = await getAllUsers();
        if (role) result = result.filter((user) => user.role == role);
        if (onlyUnapproved) result = result.filter((user) => user.approved == false);
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
