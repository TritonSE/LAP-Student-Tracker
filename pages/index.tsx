import React, { useState } from "react";
import type { NextPage } from "next";
import { CreateEventsWizard } from "../components/CreateEventsWizard";

const Home: NextPage = () => {
  const [showWizard, setShowWizard] = useState(false);
  const handleClose = (): void => {
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
