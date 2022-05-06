import React from "react";
import {AdminTeacherProfileView} from "../components/Profile/AdminTeacherProfile/AdminTeacherProfileView";
import {NextApplicationPage} from "./_app";

//This is the page that is rendered when the 'Profile' button from the Navbar is clicked
const Profile: NextApplicationPage = () => {
  return <AdminTeacherProfileView />;
};

Profile.requireAuth = true;

export default Profile;
