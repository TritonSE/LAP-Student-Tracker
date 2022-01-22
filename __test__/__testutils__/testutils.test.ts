import { apiResolver, __ApiPreviewProps } from "next/dist/server/api-utils";
import http from "http";
import supertest, { Response } from "supertest";

const makeHTTPRequest = async (server: http.Server, endpoint: string, method: string, body: Object, responseCodeExpected: number, returnExpected: Object): Promise<Response> => {
  const testServer = supertest(server);
  let res: Response;
  if (method == "POST") {
    res = await testServer
      .post(endpoint)
      .send(body)
      .expect(responseCodeExpected)
  } else {
    res = await testServer
      .get(endpoint)
      .expect(responseCodeExpected);
  }

  if (returnExpected) {
    console.log(returnExpected)
    expect(res.body).toEqual(returnExpected);
  }

  return res;
}

export { makeHTTPRequest }