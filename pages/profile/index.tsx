import React from "react";
import {AdminTeacherProfileView} from "../../components/Profile/AdminTeacherProfile/AdminTeacherProfileView";
import { NextApplicationPage } from "../_app";

//This is the page that is rendered when the 'Index' button from the Navbar is clicked
const Index: NextApplicationPage = () => {
  return <AdminTeacherProfileView />;
};

Index.requireAuth = true;

export default Index;
