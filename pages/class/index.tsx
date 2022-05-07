import React, { useContext } from "react";
import type { NextApplicationPage } from "../_app";
import { AuthContext } from "../../context/AuthContext";
import styles from "../../styles/class.module.css";
import { Error } from "../../components/util/Error";
import { ClassViewMenu } from "../../components/ClassView/ClassViewMenu";
import { Roster } from "../../components/Roster/Roster";

//This is the page that is rendered when the 'Home' button from the Navbar is clicked
const Class: NextApplicationPage = () => {
  const { user } = useContext(AuthContext);

  if (user == null) return <Error />;

  return (
    <div className={styles.container}>
            <ClassViewMenu/>
            <Roster/>
        </div>
  );
};


export default Class;