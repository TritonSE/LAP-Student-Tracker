select b.session_id, b.user_id, b.first_name, b.last_name, a.attendance from ( 
        (select user_id, c.event_information_id, first_name, last_name, session_id from (
            (select user_id, event_information_id, first_name, last_name from 
                (commitments as comm left outer join users as u on comm.user_id = u.id and u.role='Student')
            ) as c inner join calendar_information as ci on c.event_information_id = ci.event_information_id )
        ) as b left outer join attendance a on a.user_id = b.user_id and b.event_information_id = a.class_id and a.session_id = b.session_id )
      where b.session_id = $1 and b.event_information_id = $2
