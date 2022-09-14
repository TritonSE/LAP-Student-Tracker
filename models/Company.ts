import * as t from "io-ts";

export const Company = t.type({
  id: t.string,
  name: t.string,
});

export interface Company {
  id: string;
  name: string;
}
