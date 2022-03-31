import React, { useContext } from "react";
import { AdminHomeView } from "../components/Home/AdminHomeView";
import { Error } from "../components/util/Error";
import { AuthContext } from "../context/AuthContext";
import { NextApplicationPage } from "./_app";
//This is the page that is rendered when the 'Home' button from the Navbar is clicked
const Home: NextApplicationPage = () => {
  const { user } = useContext(AuthContext);
  if (user == null) return <Error />;
  const pageToRender = user.role == "Admin" ? <AdminHomeView /> : <div>Home</div>;
  return pageToRender;
};

Home.requireAuth = true;

export default Home;
