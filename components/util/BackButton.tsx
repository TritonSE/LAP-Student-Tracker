import React from "react";
import styles from "./BackButton.module.css";
import { useRouter } from "next/router";

type BackButtonProp = {
  linkTo: string;
};

export const BackButton: React.FC<BackButtonProp> = ({ linkTo }) => {
  const router = useRouter();
  return (
    <>
      <img
        src="/back_button.svg"
        onClick={() => router.push(linkTo)}
        alt="back"
        className={styles.backbutton}
      />
    </>
  );
};
