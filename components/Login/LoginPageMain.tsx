import styles from "./LoginViews.module.css";
import React from "react";
import TextField from "@mui/material/TextField";

const cssTextField = {
  color: "black",
  width: 690,
  height: 80,
  "& .MuiFilledInput-input": {
    color: "#000000",
  },
  "& .MuiFormLabel-root": {
    color: "#494C4E",
  },
};

type LoginPageMainProps = {
  pageNumber: number;
  changePage: (newPage: number) => void;
  onEmailChange: (newEmail: string) => void;
  onPasswordChange: (newPassword: string) => void;
  onLoginClick: () => void;
  onRememberMeChange: () => void;
  currRememberMe: boolean;
  currEmail: string;
  currPassword: string;
  error: Error | null;
};

const LoginPageMain: React.FC<LoginPageMainProps> = ({
  pageNumber,
  changePage,
  onEmailChange,
  onPasswordChange,
  onLoginClick,
  onRememberMeChange,
  currRememberMe,
  currEmail,
  currPassword,
  error,
}) => {
  const url = process.env.REACT_APP_BASE_URL || "http://localhost:3000";

  return (
    <div className={styles.comContainer}>
      <img src="login-logo.png" className={styles.mainPageLogo}></img>
      <div className={styles.contentContainer}>
        <h2 className={styles.title}>Login</h2>
        <TextField
          id="filled-basic"
          value={currEmail}
          label="Email"
          variant="filled"
          type="text"
          color="warning"
          InputProps={{ disableUnderline: true }}
          sx={cssTextField}
          onChange={(e) => onEmailChange(e.target.value)}
        />
        <TextField
          id="filled-basic"
          value={currPassword}
          label="Password"
          variant="filled"
          type="password"
          color="warning"
          InputProps={{ disableUnderline: true }}
          sx={cssTextField}
          onChange={(e) => onPasswordChange(e.target.value)}
        />
        <div className={styles.bottomContainer}>
          <form>
            <input
              type="checkbox"
              id="remember-me"
              name="remember-me"
              defaultChecked={currRememberMe}
              onChange={() => onRememberMeChange()}
              className={styles.checkbox}
            />
            <label className={styles.chkboxLabel}>Remember Me</label>
          </form>
          <div>
            <a className={styles.forgotPassword} href={url + "/forgotpassword"}>
              Forgot Password?
            </a>
          </div>
        </div>
        <div className={styles.passwordError}> {error != null ? error.message : ""} </div>
        <div className={styles.mainButtonContainer}>
          <button className={styles.buttonOutline} onClick={() => changePage(pageNumber + 1)}>
            Create Account
          </button>
          <button className={styles.buttonFilled} onClick={onLoginClick}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export { LoginPageMain };
