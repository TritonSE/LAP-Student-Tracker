import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { updateUser } from "../../../lib/database/users";
import { UpdateUser, UpdateUserSchema } from "../../../models/users";
import { decode } from "io-ts-promise";
import { getUser } from "../../../lib/database/users";
import { StatusCodes } from "http-status-codes";

// handles requests to /api/users/[id]
const userIDHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
  }

  const id = req.query.id as string;

  if (!id) {
    return res.status(400).json("no id specified");
  }

  switch (req.method) {
    case "GET": {
      try {
        console.log(id)
        const user = await getUser(id);
        if (user == null) {
          return res.status(StatusCodes.NOT_FOUND).json("user not found");
        }
        return res.status(StatusCodes.ACCEPTED).json(user);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    }

    case "PATCH": {
      const user = await getUser(id);
      if (user == null) {
        return res.status(StatusCodes.NOT_FOUND).json("user not found");
      }
      let newUser: UpdateUser;
      try {
        newUser = await decode(UpdateUserSchema, req.body);
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
          newUser.address,
          newUser.phoneNumber
        );
        return res.status(StatusCodes.CREATED).json(result);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    }

    default: {
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
    }
  }
};

export default userIDHandler;
