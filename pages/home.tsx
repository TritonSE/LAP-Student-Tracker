import React, { useContext } from "react";
import type { NextApplicationPage } from "./_app";
import { AdminHomePage } from "../components/Home/AdminHomePage";
import { TeacherHomePage } from "../components/Home/TeacherHomePage";
import { UserHomePage } from "../components/Home/UserHomePage";
import { AuthContext } from "../context/AuthContext";
import { CustomError } from "../components/util/CustomError";
import styles from "../styles/Home.module.css";

//This is the page that is rendered when the 'Home' button from the Navbar is clicked
const Home: NextApplicationPage = () => {
  const { user } = useContext(AuthContext);

  if (user == null) return <CustomError />;

  const renderPage = (role: string): JSX.Element => {
    switch (role) {
      case "Admin":
        return <AdminHomePage />;
      case "Teacher":
        return <TeacherHomePage userId={user.id} />;
      default:
        return <UserHomePage userId={user.id} />;
    }
  };

  return (
    <div>
      {renderPage(user.role)}
      <div className={styles.spacing} />
    </div>
  );
};

Home.requireAuth = true;

export default Home;
