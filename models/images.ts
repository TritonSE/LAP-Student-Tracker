import * as t from "io-ts";

export const ImageSchema = t.type({
  id: t.string,
  img: t.any, // TODO: Uint8Array?
  mimeType: t.string,
});

export const UpdateImageSchema = t.partial({
  id: t.string,
  img: t.any,
  mimeType: t.string,
});

export type Image = t.TypeOf<typeof ImageSchema>;
export type UpdateImage = t.TypeOf<typeof UpdateImageSchema>;