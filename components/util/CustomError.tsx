import styles from "./CustomError.module.css";
import React from "react";

// CustomError text
const CustomError: React.FC = () => {
  return <div className={styles.error}>Something went wrong.</div>;
};

export { CustomError };
