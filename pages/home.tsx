import React, { useContext } from "react";
import type { NextApplicationPage } from "./_app";
import { AuthContext } from "../context/AuthContext";
import { AdminCalendar } from "../components/Calendar/AdminCalendar";
import { UserCalendar } from "../components/Calendar/UserCalendar";
//This is the page that is rendered when the 'Home' button from the Navbar is clicked

const Home: NextApplicationPage = () => {
  const { user } = useContext(AuthContext);
  return (<AdminCalendar />);
  // Temporary comment out this line to test AdminCalendar
  //return (user?.role == 'Admin' ? <AdminCalendar /> : <UserCalendar userId={user?.id} />) 
};

Home.requireAuth = true;

export default Home;
