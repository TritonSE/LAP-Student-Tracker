import React, { useEffect, useContext } from "react";
import Calendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

const UserCalendar: React.FC<any> = ({ userId }) => {
  const _ = dayGridPlugin;
  // The following code does not retreive the events, and when you refresh the home page, a reference error is produced.
  return (
    <Calendar
      initialView="timeGridWeek"
      plugins={[timeGridPlugin]}
      height='auto'
      eventSources={[
        {
          url: '/api/event-feed/', // Have not added dynamic dates yet
          method: 'GET',
          color: 'blue',
          textColor: 'black',
        },
      ]}
      eventColor="blue"
      eventTextColor="black"
    />
  );

  // The following code does work
  /*return (
    <div>
      <FullCalendar 
        defaultView="dayGridWeek" 
        plugins={[ dayGridPlugin ]}
        height='auto'
        events={[
          {
            title: 'event1',
            allDay: true,
            start: '2022-03-10',
            end: '2022-03-11',
          },
        ]}
        eventColor="blue"
        eventTextColor="black"
      />
    </div>
  );*/
}

export { UserCalendar };