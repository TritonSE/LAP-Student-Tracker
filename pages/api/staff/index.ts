import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { createUser } from "../../../lib/database/users";
import { requestUserSchema, RequestUser } from "../../../models/users";


const userHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if(req.method == "GET"){
        res.status(200).json({ body: "staff" });
    }
    else {
        res.status(405).json({ error: "Method not allowed" });
    }
}

export default userHandler;
