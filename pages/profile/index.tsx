import React, { useContext } from "react";
import { AdminTeacherProfileView } from "../../components/Profile/AdminTeacherProfile/AdminTeacherProfileView";
import { ParentProfileView } from "../../components/Profile/ParentProfile/ParentProfileView";
import { NextApplicationPage } from "../_app";
import { AuthContext } from "../../context/AuthContext";
import { CustomError } from "../../components/util/CustomError";

//This is the page that is rendered when the 'Index' button from the Navbar is clicked
const Index: NextApplicationPage = () => {
  const { user } = useContext(AuthContext);

  if (user == null) return <CustomError />;

  switch (user.role) {
    case "Parent":
      return <ParentProfileView />;
    default:
      return <AdminTeacherProfileView />;
  }
};

Index.requireAuth = true;

export default Index;
