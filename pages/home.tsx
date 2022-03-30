import React from "react";
import { AdminHomeView } from "../components/Home/AdminHomeView";
import { NextApplicationPage } from "./_app";
//This is the page that is rendered when the 'Home' button from the Navbar is clicked
const Home: NextApplicationPage = () => {
  return <AdminHomeView />;
};

Home.requireAuth = true;

export default Home;
