import { client } from "../db";
import { Image, ImageSchema } from "../../models/images";
import { decode } from "io-ts-promise";
import {fromByteArray} from "base64-js";
// import { toByteArray, fromByteArray} from "base64-js";

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
  img: Uint8Array,
  mimeType: string
): Promise<Image | null> => {
  // const base64img =  Buffer.from(img).toString('base64');
  //
  // const bytes = new Uint8Array(Buffer.from(base64img, 'base64'));

  // const base64img = fromUint8Array(img, true)
  // const bytes = toUint8Array(base64img)
  //
  // console.log("ORIG LENGTH: " + img.length);
  // console.log("BASE 64 LENGTH: " + base64img.length);
  // console.log("BYTES LENGTH: " + bytes.length)
  // let u8s   =  new Uint8Array([100,97,110,107,111,103,97,105]);
  const b64EncodedImage = fromByteArray(img);
  console.log(b64EncodedImage.length);
  //const b64EncodedImage = Buffer.from(img).toString('base64');
  // const back = toByteArray(b64EncodedImage);

  // console.log("BACK LENGTH: " + back.length)

  // var b64string = /* whatever */;
  var buf = Buffer.from(b64EncodedImage, 'base64'); // Ta-d
  const newArr = new Uint8Array(buf);
  console.log(newArr.length)
  // console.log("NEW ARR LENGTH: " +  newArr.length);
  //
  // console.log("ORIGNIAL LENGTH: " + img.length);

  const query = {
    text:
      "UPDATE images " +
      "SET img = COALESCE($2, img), " +
      "mime_type = COALESCE($3, mime_type) " +
      "WHERE id=$1",
    values: [id, b64EncodedImage, mimeType],
  };

  try {
    await client.query(query);
  } catch (e) {
    console.log(e);
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

  // console.log(res.rows[0]);

  if (res.rows.length == 0) {
    return null;
  }



  let image = res.rows[0];
  let newImage: Image = {
    id: image.id,
    img: null,
    mimeType: null
  }
  if (image.img != null) {
    console.log("THIS RAN");
    // console.log(image.img);
    // const bytes = toByteArray(image.img);
    var buf = Buffer.from(image.img, 'base64'); // Ta-da
    const newArr = new Uint8Array(buf);
    console.log("LENGTH AFTER DECODE IN GET: " + newArr.length);
    newImage.img = newArr;
    newImage.mimeType = image.mimeType;
  }
  // try {
  //   image = await decode(ImageSchema, res.rows[0]);
  // } catch (e) {
  //   console.log(e);
  //   throw Error("Fields returned incorrectly in database");
  // }\

  return newImage;
};

export { createImage, updateImage, getImage };
