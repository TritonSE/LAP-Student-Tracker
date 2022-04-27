import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { UpdateImage, UpdateImageSchema } from "../../../models/images";
import { decode } from "io-ts-promise";
import { getImage, updateImage } from "../../../lib/database/images";
import { StatusCodes } from "http-status-codes";

// handles requests to /api/images/[id]
const imageIDHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
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
        const image = await getImage(id);
        if (image == null) {
          return res.status(StatusCodes.NOT_FOUND).json("image not found");
        }
        res.setHeader('Content-Type', image.mimeType);
        return res.status(StatusCodes.ACCEPTED).send(image.img);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
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
        const result = await updateImage(
          id,
          newImage.img,
          newImage.mimeType,
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

export default imageIDHandler;
