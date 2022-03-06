import React from "react";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { NextApplicationPage } from "./_app";

//This is the page that is rendered when the 'Profile' button from the Navbar is clicked
const Profile: NextApplicationPage = () => {
  const { user } = useContext(AuthContext);

  return <h1>{user?.firstName}</h1>;
};

Profile.requireAuth = true;

export default Profile;
