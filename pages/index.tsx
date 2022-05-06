import React from "react";
import {NextApplicationPage} from "./_app";

const Home: NextApplicationPage = () => {
  return <div>Home</div>;
};

Home.requireAuth = true;

export default Home;
