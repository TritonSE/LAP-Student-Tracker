import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import CreateEventsWizard from "../components/CreateEventsWizard";

import React, { useState } from "react";

const Home: NextPage = () => {
  const [showWizard, setShowWizard] = useState(false);
  const handleClose = () => {
    setShowWizard(false);
  };
  return (
    <div>
      <button onClick={() => setShowWizard(true)}>Create Class</button>
      {showWizard ? <CreateEventsWizard handleClose={handleClose} /> : null}
      Home
    </div>
  );
};

export default Home;
