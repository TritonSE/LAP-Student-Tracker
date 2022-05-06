import { client } from "../db";
import { Image, ImageSchema } from "../../models/images";
import { decode } from "io-ts-promise";

// creates null images entry returning id, called when new user is created
const createImage = async (): Promise<string> => {
  const query = {
    text: "INSERT INTO images(img, mime_type) VALUES(NULL, NULL) RETURNING id",
  };

  let res;
  try {
    res = await client.query(query);
  } catch (e) {
    throw Error("Error on insert into database");
  }

  return res.rows[0].id;
};

// updates existing images entry by id
const updateImage = async (
  id: string,
  img?: Uint8Array,
  mimeType?: string
): Promise<Image | null> => {
  const query = {
    text:
      "UPDATE images " +
      "SET img = COALESCE($2, img), " +
      "mime_type = COALESCE($3, mime_type) " +
      "WHERE id=$1",
    values: [id, img, mimeType],
  };

  try {
    await client.query(query);
  } catch (e) {
    throw Error("Error on update image");
  }

  return getImage(id);
};

// gets an image entry by id
const getImage = async (id: string): Promise<Image | null> => {
  const query = {
    text: "SELECT id, img, mime_type FROM images WHERE id = $1",
    values: [id],
  };

  const res = await client.query(query);

  if (res.rows.length == 0) {
    return null;
  }

  let image: Image;
  try {
    image = await decode(ImageSchema, res.rows[0]);
  } catch (e) {
    throw Error("Fields returned incorrectly in database");
  }

  return image;
};

export { createImage, updateImage, getImage };
