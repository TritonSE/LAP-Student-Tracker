import * as t from "io-ts";

const uint8array = new t.Type<Uint8Array, Uint8Array, unknown>(
  "Uint8Array",
  (input: unknown): input is Uint8Array => input instanceof Uint8Array,
  (input, context) => (input instanceof Uint8Array ? t.success(input) : t.failure(input, context)),
  t.identity
);

export const ImageSchema = t.type({
  id: t.string,
  img: t.union([uint8array, t.null]),
  mimeType: t.string,
});

export const UpdateImageSchema = t.partial({
  id: t.string,
  img: uint8array,
  mimeType: t.string,
});

export type Image = t.TypeOf<typeof ImageSchema>;
export type UpdateImage = t.TypeOf<typeof UpdateImageSchema>;
