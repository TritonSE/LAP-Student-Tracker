import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { findUser } from "../../../lib/database/users";
import { requestUserSchema, RequestUser, User } from "../../../models/users";


const userHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {

    if(req.method == "GET"){
        let identifier = req.query['id'] as string;

        res.status(200).json({ body: identifier})
        try {
            const user = await findUser(identifier);
            res.status(200).json({ body: user})
        }
        catch (e) {
            res.status(500).json({ error: "Database failure" })
        }        
    }


    else {
        res.status(405).json({ error: "Method not allowed" });
      }
};

export default userHandler;