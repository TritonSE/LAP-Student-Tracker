import styles from "../../styles/components/util/Loading.module.css";
import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

// Loading animation
const Loader: React.FC = () => {
  return (
    <div className={styles.loader}>
      <ClipLoader loading={true} size={30} color={"#f37121"} />
    </div>
  );
};

export { Loader };