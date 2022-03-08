<<<<<<< HEAD
import React, { useState } from "react";
import type { NextPage } from "next";
import { CreateEventsWizard } from "../components/CreateEventsWizard";
import styles from "../styles/Home.module.css";
//This is the page that is rendered when the 'Home' button from the Navbar is clicked
const Home: NextPage = () => {
  const [showWizard, setShowWizard] = useState(false);
  const handleClose = (): void => {
    setShowWizard(false);
  };
  return (
    <div className={styles.homeWrapper}>
      <button className={styles.createBtn} onClick={() => setShowWizard(true)}>
        Create
        <img className={styles.addIcon} src="AddIcon.png" />
      </button>
      {showWizard ? <CreateEventsWizard handleClose={handleClose} /> : null}
    </div>
  );
=======
import React from "react";
import type { NextApplicationPage } from "./_app";
//This is the page that is rendered when the 'Home' button from the Navbar is clicked

const Home: NextApplicationPage = () => {
  return <div>Home</div>;
>>>>>>> origin/master
};

Home.requireAuth = true;

export default Home;
