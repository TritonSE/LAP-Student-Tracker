import React from "react";
import styles from "../../styles/components/LoginViews.module.css";


type LoginPageNavigationProps = {
  completedPages: boolean[];
  currPage: number;
  onPageChange: (newPage: number) => void;
  onSignUpClick: () => void;
};

const LoginPageNavigation: React.FC<LoginPageNavigationProps> = ({
  completedPages,
  currPage,
  onPageChange,
  onSignUpClick,
}) => {
  const nextButtonText = currPage === 3 ? "Sign Up" : "Next";
  const nextButtonFunction = (): void => {
    if (currPage === 3) onSignUpClick();
    else {
      onPageChange(currPage + 1);
    }
  };

  return (
    <div className={styles.buttonContainer}>
      <button className={styles.buttonOutline} onClick={() => onPageChange(currPage - 1)}>
        Back
      </button>
      <button
        className={styles.buttonFilled}
        onClick={() => nextButtonFunction()}
        disabled={!completedPages[currPage]}
      >
        {nextButtonText}
      </button>
    </div>
  );
};

export { LoginPageNavigation };
