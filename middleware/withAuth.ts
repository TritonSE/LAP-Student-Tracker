import { fbAdminAuth } from "./auth";
import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";

const withAuth = (handler: NextApiHandler) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {

        const token = req.headers['authorization'] as string;

        if (!token) {
            return res.status(401).json("Authentication failed");
        }

        if (token.indexOf("Bearer ") != 0) {
            return res.status(401).json("Authentication header malformed");
        }

        const tokenWithoutBearer = token.replace("Bearer ", "");

        try {
            // Verify token
            await fbAdminAuth.verifyIdToken(tokenWithoutBearer);
            return handler(req, res);
        } catch (error) {
            return res.status(401).json('Authentication failed');
        }
    };
};

export { withAuth };