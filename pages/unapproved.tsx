import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/router";
import styles from "../styles/Unapproved.module.css";

const Unapproved: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const router = useRouter();

  const returnToSignUp = (): void => {
    logout();
    router.push("/login");
  };

  return (
    <>
      <div className={styles.headerContainer}>
        <div className={styles.headerLogo}>
          <img src="logo1.png"></img>
          <img src="logo2.png"></img>
        </div>
      </div>
      <div className={styles.unapprovedContainer}>
        <div className={styles.textContainer}>
          <h1>We are verifying your account.</h1>
          <p>Please hold tight until we review your credentials.</p>
          <p>Have any questions? Please email admin@jointheleague.org</p>
        </div>
        <div className={styles.spacing}></div>
        <div className={styles.returnBtnContainer}>
          <button className={styles.returnBtn} onClick={() => returnToSignUp()}>
            Return to Sign up
          </button>
        </div>
      </div>
    </>
  );
};

export default Unapproved;
