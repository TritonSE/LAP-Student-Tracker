import React from "react";
import type { NextApplicationPage } from "./_app";
//This is the page that is rendered when the 'Home' button from the Navbar is clicked

const Home: NextApplicationPage = () => {
  return <div>Home</div>;
};

Home.requireAuth = true;

export default Home;
