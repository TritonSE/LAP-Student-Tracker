import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { VolunteerResponse } from "../../../../models";
import { StatusCodes } from "http-status-codes";
import { decode } from "io-ts-promise";
import { onError } from "../../../../logger/logger";
import { getUser } from "../../../../lib/database/users";
import { postExperience, getResponse } from "../../../../lib/database/volunteer-questions";
import { withLogging } from "../../../../middleware/withLogging";

export const volunteerHandler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!req.query) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
  }

  const id = req.query.id as string;

  if (!id) {
    return res.status(400).json("no id specified");
  }

  const user = await getUser(id);
  if (user == null) {
    return res.status(StatusCodes.NOT_FOUND).json("user not found");
  }

  switch (req.method) {
    case "POST": {
      let responses: VolunteerResponse;
      try {
        responses = await decode(VolunteerResponse, req.body);
      } catch (e) {
        onError(e);
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }

      try {
        await postExperience(id, responses.about, responses.experience);
        return res.status(StatusCodes.CREATED).json("Ok");
      } catch (e) {
        onError(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    }

    case "GET": {
      try {
        const responses = await getResponse(id);
        if (responses == null) {
          return res.status(StatusCodes.NOT_FOUND).json("response not found");
        }
        return res.status(StatusCodes.OK).json(responses);
      } catch (e) {
        onError(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    }
  }
};

export default withLogging(volunteerHandler);
