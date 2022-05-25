import * as t from "io-ts";

export const ImageSchema = t.type({
  id: t.string,
  img: t.union([t.string, t.null]),
  mimeType: t.union([t.string, t.null]),
});

export const UpdateImageSchema = t.partial({
  img: t.string,
  mimeType: t.string,
});

export type Image = t.TypeOf<typeof ImageSchema>;
export type UpdateImage = t.TypeOf<typeof UpdateImageSchema>;
