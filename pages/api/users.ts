// POST new user to database

// GET user based on id

// GET list of all users

// GET list of all users with a certain role

// PATCH new user information given an id

// GET all staff


// import { object, string, TypeOf } from "yup"; 

// export const userScheme = object({
//     id: string().ensure().required(),
//     firstName: string().ensure().required(),
//     lastName: string().ensure().required(),
//     email: string().ensure().required(),
//     role: string().ensure().required(), // parent, volunteer, student, admin, teacher
//     phoneNumber: string().optional(),    
// })

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
      // validate the incoming request schema
      // we will be using yup to validate JSON being sent to the API
      // relevent docs: https://github.com/jquense/yup
      newUser = await requestUserSchema.validate(req.body);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: "Fields are not correctly entered" });
    }
    try {
      // call the function that actually inserts the data into the database
      const result = await createUser(
        newUser.email,
        newUser.role,
        newUser.firstName,
        newUser.lastName,
        newUser.phone
      );
      return res.status(201).json(result);
    } catch (e) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};