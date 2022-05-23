import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { UpdateImage, UpdateImageSchema } from "../../../models/images";
import { decode } from "io-ts-promise";
import { getImage, updateImage } from "../../../lib/database/images";
import { StatusCodes } from "http-status-codes";
import { withAuth } from "../../../middleware/withAuth";

// handles requests to /api/images/[id]
const imageIDHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
  }

  const id = req.query.id as string;

  if (!id) {
    return res.status(400).json("no id specified");
  }

  switch (req.method) {
    case "GET": {
      try {
        const image = await getImage(id);
        if (image == null) {
          return res.status(StatusCodes.NOT_FOUND).json("image not found");
        }
        return res.status(StatusCodes.ACCEPTED).json(image);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
      }
    }

    case "PATCH": {
      const image = await getImage(id);
      if (image == null) {
        return res.status(StatusCodes.NOT_FOUND).json("image not found");
      }
      let newImage: UpdateImage;
      try {
        newImage = await decode(UpdateImageSchema, req.body);
      } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {
        const result = await updateImage(id, newImage.img || null, newImage.mimeType || "");
        if (result == null) {
          return res.status(StatusCodes.NOT_FOUND).json("image not found");
        }
        return res.status(StatusCodes.ACCEPTED).json(result);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
      }
    }

    default: {
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
    }
  }
};

export default withAuth(imageIDHandler);
