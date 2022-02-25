import { NextApiRequest, NextApiResponse } from "next/types";
import { createMocks, MockResponse, RequestMethod } from "node-mocks-http";
import { CreateClassEvent, ClassEvent } from "../../models/events";

/**
 * Create and test a HTTP Request
 *
 * @param handler the handler that defines the API route
 * @param endpoint the API request endpoint
 * @param query the query that goes with the request
 * @param method the type of request
 * @param body the body of the request
 * @param expectedResponseCode the expected response code
 * @param expectedBody the expected body of the response
 * @returns result of the operation (whether the test passes or not)
 */
const makeHTTPRequest = async (
  handler: (req: NextApiRequest, res: NextApiResponse<any>) => void | Promise<void>,
  endpoint: string,
  query: Object | undefined,
  method: RequestMethod,
  body: Object | undefined,
  expectedResponseCode: number,
  expectedBody: Object
): Promise<MockResponse<NextApiResponse<any>>> => {
  const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
    method: method,
    url: endpoint,
    query: query,
    body: body,
  });

  await handler(req, res);

  expect(res._getStatusCode()).toBe(expectedResponseCode);
  expect(JSON.parse(res._getData())).toEqual(expectedBody);

  return res;
};

const makeEventHTTPRequest = async (
  handler: (req: NextApiRequest, res: NextApiResponse<any>) => void | Promise<void>,
  endpoint: string,
  query: Object | undefined,
  method: RequestMethod,
  body: Object | undefined,
  expectedResponseCode: number,
  expectedBody: ClassEvent
): Promise<MockResponse<NextApiResponse<any>>> => {
  const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
    method: method,
    url: endpoint,
    query: query,
    body: body,
  });

  await handler(req, res);

  expect(res._getStatusCode()).toBe(expectedResponseCode);
  expect(JSON.parse(res._getData())).toEqual(expect.objectContaining({
      eventInformationId: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
      startTime: expectedBody.startTime,
      endTime: expectedBody.endTime,
      timeZone: expectedBody.timeZone,
      rrule: expectedBody.rrule,
      language: expectedBody.language,
      neverEnding: expectedBody.neverEnding,
      backgroundColor: expectedBody.backgroundColor
    }),
  );

  return res;
};

export { makeHTTPRequest, makeEventHTTPRequest };
