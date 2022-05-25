import React from "react";
import { UserCalendar } from "./Calendar/UserCalendar";

type UserHomeProp = {
  userId: string;
};

const UserHomePage: React.FC<UserHomeProp> = ({ userId }) => {
  return (
    <div>
      <UserCalendar userId={userId} />
    </div>
  );
};

export { UserHomePage };
