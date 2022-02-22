import styles from "../styles/components/Error.module.css";
import React from "react";

const Error: React.FC = () => {
  return <div className={styles.error}>Something went wrong.</div>;
};

export default Error;
