import React, { useEffect, useContext } from "react";
import Calendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

const AdminCalendar: React.FC<any> = () => {
  const _ = dayGridPlugin;
  // The following code does not retreive the events, and when you refresh the home page, a reference error is produced.
  return (
    <Calendar
      initialView="timeGridWeek"
      plugins={[timeGridPlugin]}
      height='100%'
      expandRows={true}
      // height='650'
      eventSources={[
        {
          url: '/api/event-feed/', // Have not added dynamic dates yet
          method: 'GET',
          color: 'blue',
          textColor: 'black',
        },
      ]}
      // events={[
      //   {
      //     // id: '7127847e-8189-4415-8717-4ebd40962942',
      //     title: 'Math 101',
      //     // backgroundColor: '#ffe94d',
      //     start: '2022-03-11T19:45:00+00:00',
      //     end: '2022-03-11T21:45:00+00:00'
      //   }
      // ]}
      eventColor="blue"
      eventTextColor="black"
      scrollTime='06:00:00'
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

export { AdminCalendar };