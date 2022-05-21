import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { getSingleUserAttendanceFromClassID } from "../../../../../lib/database/attendance";

export const userAttendanceHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) =>{

    if (!req.query) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
    }

    const userId = req.query.id as string;
    const classId = req.query.class_id as string;

    if (!userId){
        return res.status(StatusCodes.BAD_REQUEST).json("No id specified");
    }
    if (!classId){
        return res.status(StatusCodes.BAD_REQUEST).json("No class id specified");
    }
    
    if (req.method == "GET"){
        try{
            const attendance = await getSingleUserAttendanceFromClassID(userId, classId);
            return res.status(StatusCodes.ACCEPTED).json(attendance);
        } catch(e) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
        }
    }
    else{
        return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
    }
    
}

export default userAttendanceHandler;