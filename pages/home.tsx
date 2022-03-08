import React, { useState } from "react";
import { CreateEventsWizard } from "../components/CreateEventsWizard";
import styles from "../styles/Home.module.css";
import { NextApplicationPage } from "./_app";
//This is the page that is rendered when the 'Home' button from the Navbar is clicked
const Home: NextApplicationPage = () => {
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
};

Home.requireAuth = true;

export default Home;
