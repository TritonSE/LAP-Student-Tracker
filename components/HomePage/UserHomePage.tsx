import React from "react";
import {UserCalendar} from "../Calendar/UserCalendar";

type UserHomeProp = {
  userId: string;
};

const UserHomePage: React.FC<UserHomeProp> = ({ userId }) => {
  return <UserCalendar userId={userId} />;
};

export { UserHomePage };
