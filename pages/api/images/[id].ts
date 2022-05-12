import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { UpdateImage, UpdateImageSchema } from "../../../models/images";
import { decode } from "io-ts-promise";
import { getImage, updateImage } from "../../../lib/database/images";
import { StatusCodes } from "http-status-codes";
import {withAuth} from "../../../middleware/withAuth";
import { buffer } from "micro";

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
        console.log("MIME TYPE OF GET" + image?.mimeType);
        // console.log("IMAGE LENGTH" )
        // console.log(image.img.length);
        if (image == null) {
          return res.status(StatusCodes.NOT_FOUND).json("image not found");
        }
        res.setHeader("Content-Type", "image/jpeg");
        console.log(res.getHeaders());
        console.log("LENGTH OF IMAGE IN API HANDLER: " + image.img.length);
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
      console.log(req.headers);
      const buff = await buffer(req, {limit:'5mb', encoding:'binary'});
      console.log(buff);
      if (typeof buff == 'string') return res.status(StatusCodes.NOT_FOUND).json("image not found");;

      // const buff = new Uint8Array(req);
      // const buff = Buffer.from(req.body as Uint8Array, "binary")
      const uin8arr  = new Uint8Array(buff);
      console.log(uin8arr.length);
      // console.log("PATCH REQ LENGHT " + req.body.length)
      const updatedImage:UpdateImage = {
        img: req.body as Uint8Array, mimeType: "image/jpeg"
      };

      // console.log("UPDATED IMAGE LENGTH")
      // console.log(updatedImage.img.length);
      // try {
      //   newImage = await decode(UpdateImageSchema, req.body);
      // } catch (e) {
      //   console.log(e);
      //   return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      // }
      try {
        const result = await updateImage(id, updatedImage.img, updatedImage.mimeType);
        if (result == null) {
          return res.status(StatusCodes.NOT_FOUND).json("image not found");
        }
        req.pipe()
        res.setHeader("Content-Type", "image/jpeg");
        console.log("LENGTH OF IMAGE IN PATCH API HANDLER: " + result.img.length);
        return res.status(StatusCodes.ACCEPTED).send(result.img);
      } catch (e) {
        console.log(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    }

    default: {
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
    }
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
}

export default withAuth(imageIDHandler);
