import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getClass, updateClass } from "../../../../lib/database/classes";
import { UpdateClass } from "../../../../models";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";
import { withAuth } from "../../../../middleware/withAuth";
import {logHttpRoute, onError} from "../../../../lib/util/helpers";
import {withLogging} from "../../../../middleware/withLogging";

/**
 * @swagger
 * /api/class/{id}:
 *  get:
 *    description: Gets the information for a specific class
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      202:
 *        description: Class found successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Class'
 *  patch:
 *    description: Edit the information for a specific class
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      description: Update data for class. Times are non-updatable
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/UpdateClass'
 *    responses:
 *      201:
 *        description: Class successfully updated
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Class'
 */
export const classIDHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
  }

  const id = req.query.id as string;
  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json("no id specified");
  }
  switch (req.method) {
    case "GET": {
      try {
        const classes = await getClass(id);
        if (classes == null) {
          return res.status(StatusCodes.NOT_FOUND).json("class not found");
        }
        return res.status(StatusCodes.ACCEPTED).json(classes);
      } catch (e) {
        onError(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
      }
    }

    case "PATCH": {
      let newClass: UpdateClass;
      if ((await getClass(id)) == null) {
        return res.status(StatusCodes.NOT_FOUND).json("class not found");
      }

      try {
        newClass = await decode(UpdateClass, req.body);
      } catch (e) {
        onError(e);
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {
        const result = await updateClass(
          id,
          newClass.minLevel,
          newClass.maxLevel,
          newClass.rrstring,
          newClass.startTime,
          newClass.endTime,
          newClass.language
        );
        return res.status(StatusCodes.CREATED).json(result);
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

export default withLogging(withAuth(classIDHandler));
