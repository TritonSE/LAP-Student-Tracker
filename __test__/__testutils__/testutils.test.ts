import { NextApiRequest, NextApiResponse } from "next/types";
import { createMocks, MockResponse, RequestMethod } from "node-mocks-http";

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

  return res;
}

export { makeHTTPRequest }