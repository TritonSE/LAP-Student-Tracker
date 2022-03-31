/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { NextApiRequest, NextApiResponse } from "next/types";
import { createMocks, MockResponse, RequestMethod } from "node-mocks-http";
import { DateTime } from "luxon";
import { ClassEvent, CalendarEvent } from "../../models/events";


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
 *
 * Note: Record<String, unknown> is just a type-safe way to specify an object
 */
const makeHTTPRequest = async (
  handler: (req: NextApiRequest, res: NextApiResponse<any>) => void | Promise<void>,
  endpoint: string,
  query: Object | undefined,
  method: RequestMethod,
  body: Object | undefined,
  expectedResponseCode: number | undefined,
  expectedBody: Object | undefined
): Promise<MockResponse<NextApiResponse<any>>> => {
  const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
    method: method,
    url: endpoint,
    query: query,
    body: body,
  });

  await handler(req, res);

  if (expectedResponseCode) expect(res._getStatusCode()).toBe(expectedResponseCode);
  if (expectedBody) {
    expect(JSON.parse(res._getData())).toEqual(expectedBody);
  }
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
  expect(JSON.parse(res._getData())).toEqual(
    expect.objectContaining({
      eventInformationId: expect.stringContaining('-' // Checks if string matches to UUID format
      ),
      startTime: expectedBody.startTime,
      endTime: expectedBody.endTime,
      timeZone: expectedBody.timeZone,
      rrule: expectedBody.rrule,
      language: expectedBody.language,
      neverEnding: expectedBody.neverEnding,
      backgroundColor: expectedBody.backgroundColor,
    })
  );

  return res;
};

/* HTTP request handler for event feed API that converts Postgres timestamps to
   local ISO for consistency in testing */
const makeEventFeedHTTPRequest = async (
  handler: (req: NextApiRequest, res: NextApiResponse<any>) => void | Promise<void>,
  endpoint: string,
  query: Object | undefined,
  method: RequestMethod,
  queryParams: { start: string; end: string; userId?: string },
  expectedResponseCode: number,
  expectedBody: CalendarEvent[]
): Promise<MockResponse<NextApiResponse<any>>> => {
  const res = await makeHTTPRequest(
    handler,
    endpoint +
    `?start=${queryParams.start}&end=${queryParams.end}` +
    (queryParams.userId ? `&userId=${queryParams.userId}` : ""),
    query,
    method,
    undefined,
    expectedResponseCode,
    undefined
  );

  // Convert dates in actual body to local ISO
  const returnedCalendarEvents = (JSON.parse(res._getData()) as CalendarEvent[]).map((event) =>
    convertToLocalISO(event)
  );
  // Convert dates in expected body to local ISO
  const expectedCalendarEvents = expectedBody.map((event) => convertToLocalISO(event));

  // Compare actual and expected array lengths and contents
  expect(returnedCalendarEvents.length).toBe(expectedCalendarEvents.length);
  expect(returnedCalendarEvents).toEqual(expect.arrayContaining(expectedCalendarEvents));

  return res;
};



/* Converts startStr and endStr in CalendarEvent object to local ISO */
const convertToLocalISO = (event: CalendarEvent): CalendarEvent => {
  event.startStr = DateTime.fromJSDate(new Date(event.startStr)).toLocal().toISO();
  event.endStr = DateTime.fromJSDate(new Date(event.endStr)).toLocal().toISO();
  return event;
};

export { makeHTTPRequest, makeEventHTTPRequest, makeEventFeedHTTPRequest };
