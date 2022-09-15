import * as t from "io-ts";


export const CalendarEvent = t.type({
    id: t.string,
    title: t.string,
    backgroundColor: t.string,
    start: t.string,
    end: t.string
})

export interface CalendarEvent {
    id: string,
    title: string,
    backgroundColor: string,
    start: string,
    end: string
}