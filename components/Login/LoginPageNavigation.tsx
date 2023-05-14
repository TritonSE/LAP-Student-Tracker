import React from "react";
import styles from "./LoginViews.module.css";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

type LoginPageNavigationProps = {
  completedPages: boolean[];
  currPage: number;
  onPageChange: (newPage: number) => void;
  onSignUpClick: () => void;
  loading: boolean;
};
// handles navigating the create account navigation (login page navigation in LoginPageMain component)
const LoginPageNavigation: React.FC<LoginPageNavigationProps> = ({
  completedPages,
  currPage,
  onPageChange,
  onSignUpClick,
  loading,
}) => {
  const nextButtonText = currPage === 3 ? "Sign Up" : "Next";
  const nextButtonFunction = (): void => {
    if (currPage === 3) {
      onSignUpClick();
    } else {
      onPageChange(currPage + 1);
    }
  };

  return (
    <div className={styles.buttonContainer}>
      <Button size="large" variant="outlined" onClick={() => onPageChange(currPage - 1)}>
        Back
      </Button>
      <LoadingButton
        loading={loading}
        size="large"
        variant="contained"
        onClick={() => nextButtonFunction()}
        disabled={!completedPages[currPage]}
      >
        {nextButtonText}
      </LoadingButton>
    </div>
  );
};

export { LoginPageNavigation };
