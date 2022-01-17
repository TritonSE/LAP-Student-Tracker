// POST new user to database

// GET user based on id

// GET list of all users

// GET list of all users with a certain role

// PATCH new user information given an id

// GET all staff


// import { object, string, TypeOf } from "yup"; 


import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { createUser } from "../../../lib/database/users";
import { requestUserSchema, RequestUser } from "../../../models/users";

/**
 * This handles a POST request to /api/users. In Next.js, the file names are what
 * denotes the route. Read more about requests within Next here:
 * https://nextjs.org/docs/api-routes/response-helpers
 *
 */
export const userHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    let newUser;
    try {
      newUser = await requestUserSchema.validate(req.body);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: "Fields are not correctly entered" });
    }
    try {
      // call the function that actually inserts the data into the database
      const result = await createUser(
        newUser.id,
        newUser.first_name,
        newUser.last_name,
        newUser.email,
        newUser.role,
        newUser.address,
        newUser.phone_number,
      );
      return res.status(201).json(result);
    } catch (e) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};