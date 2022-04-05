import React, { useContext } from "react";
import type { NextApplicationPage } from "./_app";
import { AuthContext } from "../context/AuthContext";
import { AdminHomePage } from "../components/HomePage/AdminHomePage";
import { UserHomePage } from "../components/HomePage/UserHomePage";
import { Error } from "../components/util/Error";

//This is the page that is rendered when the 'Home' button from the Navbar is clicked
const Home: NextApplicationPage = () => {
  const { user } = useContext(AuthContext);

  if (user == null) return <Error />;

  return user.role == "Admin" ? <AdminHomePage /> : <UserHomePage userId={user.id} />;
};

Home.requireAuth = true;

export default Home;
