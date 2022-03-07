import React from "react";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { NextApplicationPage } from "./_app";

//This is the page that is rendered when the 'Profile' button from the Navbar is clicked
const Profile: NextApplicationPage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>FIRST NAME: </h1>
      <div> {user?.firstName} </div>
      <h2>LAST NAME</h2>
      <div> {user?.lastName}</div>
    </div>
  );
};

Profile.requireAuth = true;

export default Profile;
