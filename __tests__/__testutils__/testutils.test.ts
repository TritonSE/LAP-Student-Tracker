/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// have to disable type checking for this file because of https://github.com/howardabrams/node-mocks-http/issues/245
import { NextApiRequest, NextApiResponse } from "next/types";
import { createMocks, MockResponse, RequestMethod } from "node-mocks-http";
import { DateTime } from "luxon";
import { CalendarEvent, ClassEvent } from "../../models/events";
import { SingleUserAttendance } from "../../models/attendance";

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
 * @param ignoreResKey keys in the response to ignore when comparing object equality
 * @returns result of the operation (whether the test passes or not)
 *
 */
const makeHTTPRequest = async (
  handler: (req: NextApiRequest, res: NextApiResponse<any>) => any,
  endpoint: string,
  query: Object | undefined,
  method: RequestMethod,
  body: Object | undefined,
  expectedResponseCode: number | undefined,
  expectedBody: Object | undefined,
  ignoreResKey?: string
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
    const resData = JSON.parse(res._getData());
    // key to ignore in actual body when comparing with expected body
    // use for randomly generated IDs that can't be predetermined
    if (ignoreResKey) {
      expect(resData).toHaveProperty(ignoreResKey);
      delete resData[ignoreResKey];
      // eslint-disable-next-line no-prototype-builtins
      if (expectedBody.hasOwnProperty(ignoreResKey)) delete expectedBody[ignoreResKey];
    }

    expect(resData).toEqual(expectedBody);
  }
  return res;
};

const makeEventHTTPRequest = async (
  handler: (req: NextApiRequest, res: NextApiResponse<any>) => any,
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

const makeSingleUserAttendanceHTTPRequest = async (
  handler: (req: NextApiRequest, res: NextApiResponse<any>) => any,
  endpoint: string,
  query: Object | undefined,
  method: RequestMethod,
  expectedResponseCode: number,
  expectedBody: SingleUserAttendance[]
): Promise<MockResponse<NextApiResponse<any>>> => {
  const res = await makeHTTPRequest(
    handler,
    endpoint,
    query,
    method,
    undefined,
    expectedResponseCode,
    undefined
  );

  const returnedAttendanceObjects = (JSON.parse(res._getData()) as SingleUserAttendance[]).map(
    (event: SingleUserAttendance) => convertSingleUserAttendanceFieldsToLocalISO(event)
  );

  const expectedAttendanceObjects = expectedBody.map((event) =>
    convertSingleUserAttendanceFieldsToLocalISO(event)
  );

  expect(returnedAttendanceObjects.length).toBe(expectedAttendanceObjects.length);
  expect(returnedAttendanceObjects).toEqual(expect.arrayContaining(expectedAttendanceObjects));

  return res;
};

/* HTTP request handler for event feed API that converts Postgres timestamps to
   local ISO for consistency in testing */
const makeEventFeedHTTPRequest = async (
  handler: (req: NextApiRequest, res: NextApiResponse<any>) => any,
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
    convertCalendarEventFieldsToLocalISO(event)
  );
  // Convert dates in expected body to local ISO
  const expectedCalendarEvents = expectedBody.map((event) =>
    convertCalendarEventFieldsToLocalISO(event)
  );

  // Compare actual and expected array lengths and contents
  expect(returnedCalendarEvents.length).toBe(expectedCalendarEvents.length);
  expect(returnedCalendarEvents).toEqual(expect.arrayContaining(expectedCalendarEvents));

  return res;
};

/* Converts startStr and endStr in CalendarEvent object to local ISO */
const convertCalendarEventFieldsToLocalISO = (event: CalendarEvent): CalendarEvent => {
  event.start = DateTime.fromJSDate(new Date(event.start)).toLocal().toISO();
  event.end = DateTime.fromJSDate(new Date(event.end)).toLocal().toISO();
  return event;
};

const convertSingleUserAttendanceFieldsToLocalISO = (
  attend: SingleUserAttendance
): SingleUserAttendance => {
  attend.start = DateTime.fromISO(attend.start).toLocal().toISO();
  return attend;
};

const convertTimeToISO = (time: string, timeZone: string): string => {
  return DateTime.fromFormat(time, "HH:mm", { zone: timeZone }).toISOTime();
};

const getISOTimeFromExplicitFields = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string
): string => {
  return DateTime.fromObject(
    { year: year, month: month, day: day, hour: hour, minute: minute },
    { zone: timeZone }
  )
    .toLocal()
    .toISO();
};

export {
  makeHTTPRequest,
  makeEventHTTPRequest,
  makeEventFeedHTTPRequest,
  convertTimeToISO,
  getISOTimeFromExplicitFields,
  makeSingleUserAttendanceHTTPRequest,
};
