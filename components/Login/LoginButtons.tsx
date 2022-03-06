import React from "react";
import styles from "../../styles/components/LoginViews.module.css";
import style2 from "../../styles/Login.module.css";

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
      console.log("thigns change");
      onPageChange(currPage + 1);
    }
  };

  return (
    <div className={style2.buttonContainer}>
      <button className={style2.buttonOutline} onClick={() => onPageChange(currPage - 1)}>
        Back
      </button>
      <button
        className={style2.buttonFilled}
        onClick={() => nextButtonFunction()}
        disabled={!completedPages[currPage]}
      >
        {nextButtonText}
      </button>
    </div>
  );
};

export { LoginPageNavigation };
