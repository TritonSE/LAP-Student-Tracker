import React, { useContext } from "react";
import type { NextApplicationPage } from "./_app";
import { AuthContext } from "../context/AuthContext";
import { AdminHomePage } from "../components/HomePage/AdminHomePage";
import { TeacherHomePage } from "../components/HomePage/TeacherHomePage";
import { UserHomePage } from "../components/HomePage/UserHomePage";
import { Error } from "../components/util/Error";
import styles from "../styles/Home.module.css";

//This is the page that is rendered when the 'Home' button from the Navbar is clicked
const Home: NextApplicationPage = () => {
  const { user } = useContext(AuthContext);

  if (user == null) return <Error />;

  const renderPage = (role: string) => {
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
