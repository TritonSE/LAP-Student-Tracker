import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { UpdateImage } from "../../../models";
import { decode } from "io-ts-promise";
import { getImage, updateImage } from "../../../lib/database/images";
import { StatusCodes } from "http-status-codes";
import { withAuth } from "../../../middleware/withAuth";
import {withLogging} from "../../../middleware/withLogging";
import {onError} from "../../../lib/util/helpers";

/**
 * @swagger
 * /api/images/{id}:
 *  get:
 *    description: get the b64 encoded image associated with the id
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      202:
 *        description: Image found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Image'
 *  patch:
 *    description: update the image data associated with this id
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      description: Fields to be updated. img should be b64 encoding of image
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/UpdateImage'
 *    responses:
 *      202:
 *        description: Image updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Image'
 * @param req
 * @param res
 */
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
        onError(e);
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
        newImage = await decode(UpdateImage, req.body);
      } catch (e) {
        onError(e);
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {
        const result = await updateImage(id, newImage.img || null, newImage.mimeType || "");
        if (result == null) {
          return res.status(StatusCodes.NOT_FOUND).json("image not found");
        }
        return res.status(StatusCodes.ACCEPTED).json(result);
      } catch (e) {
        onError(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
      }
    }

    default: {
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
    }
  }
};

export default withLogging(withAuth(imageIDHandler));
