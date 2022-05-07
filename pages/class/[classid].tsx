import React, { useContext } from "react";
import type { NextApplicationPage } from "../_app";
import { AuthContext } from "../../context/AuthContext";

import { Error } from "../../components/util/Error";
import { ClassViewMenu } from "../../components/ClassView/ClassViewMenu";

//This is the page that is rendered when the 'Home' button from the Navbar is clicked
const Class: NextApplicationPage = () => {
  const { user } = useContext(AuthContext);

  if (user == null) return <Error />;

  return (
    <ClassViewMenu/>
  );
};


export default Class;