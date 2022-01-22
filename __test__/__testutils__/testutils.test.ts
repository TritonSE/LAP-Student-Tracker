import { NextApiRequest, NextApiResponse } from "next/types";
import { createMocks, MockResponse, RequestMethod } from "node-mocks-http";

<<<<<<< HEAD
const makeHTTPRequest = async (server: http.Server, endpoint: string, method: string, body: Object | undefined, responseCodeExpected: number, returnExpected: Object): Promise<Response> => {
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
    // console.log(returnExpected)
    expect(res.body).toEqual(returnExpected);
  }
=======
const makeHTTPRequest = async (handler: (req: NextApiRequest, res: NextApiResponse<any>) => void | Promise<void>, endpoint: string, query: Object | undefined, method: RequestMethod, body: Object | undefined, expectedResponseCode: number, expectedBody: Object): Promise<MockResponse<NextApiResponse<any>>> => {

  const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
    method: method,
    url: endpoint,
    query: query,
    body: body
  });

  await handler(req, res)

  expect(res._getStatusCode()).toBe(expectedResponseCode)
  expect(JSON.parse(res._getData())).toEqual(expectedBody)
>>>>>>> hotfix/Anshul-Birla/fix-jest-issues

  return res;
}

export { makeHTTPRequest }