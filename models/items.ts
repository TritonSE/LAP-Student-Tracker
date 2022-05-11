import * as t from "io-ts";

export const ItemSchema = t.type({
  moduleId: t.string,
  itemId: t.string,
  title: t.string,
  link: t.string,
});

export const CreateItemSchema = t.type({
  title: t.string,
  link: t.string,
});

export const ItemArraySchema = t.array(ItemSchema);

export type Item = t.TypeOf<typeof ItemSchema>;
export type CreateItem = t.TypeOf<typeof CreateItemSchema>;