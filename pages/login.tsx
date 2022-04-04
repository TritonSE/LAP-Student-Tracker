import { useRouter } from "next/router";
import React, { useState, useContext } from "react";
import { LoginPageMain } from "../components/Login/LoginPageMain";
import { LoginNameInput } from "../components/Login/LoginNameInput";
import { LoginPositionInput } from "../components/Login/LoginPositionInput";
import { CreateEmailAndPassword } from "../components/Login/CreateEmailAndPassword";
import { AuthContext } from "../context/AuthContext";
import { LoginPageNavigation } from "../components/Login/LoginPageNavigation";
import { Roles } from "../models/users";

const Login: React.FC = () => {
  const auth = useContext(AuthContext);
  const router = useRouter();

  if (auth.user !== null) {
    router.push("/home");
  }
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [position, setPosition] = useState<Roles>("Admin");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleEmail = (newEmail: string): void => {
    setEmail(newEmail);
  };

  const handlePassword = (newPassword: string): void => {
    setPassword(newPassword);
  };

  const handleRememberMe = (): void => {
    setRememberMe(!rememberMe);
  };

  const handleFirstName = (newFirstName: string): void => {
    setFirstName(newFirstName);
  };

  const handleLastName = (newLastName: string): void => {
    setLastName(newLastName);
  };

  const handlePosition = (newPosition: Roles): void => {
    setPosition(newPosition);
  };

  const handleConfirmPassword = (confirmPassword: string): void => {
    setConfirmPassword(confirmPassword);
  };

  // handler to change the page being displayed - clear errors on every page change so errors are not propogated to later pages
  const handlePage = (newPage: number): void => {
    auth.clearError();
    setCurrentPage(newPage);
  };
  // need to check if field is empty string so error message does not pop up initially

  // simlpe regex to check if input is a valid email
  const regEx = RegExp(/\S+@\S+\.\S+/);
  const validEmail = email == "" || regEx.test(email);

  // firebase requires passwords to be greater than 6 characters
  const passwordLengthOk = password == "" || password.length > 6;
  const passwordsMatch = password == "" || password === confirmPassword;

  const namePageDone = firstName != "" && lastName != "";
  const createAccountPageDone =
    email != "" &&
    password != "" &&
    confirmPassword != "" &&
    passwordLengthOk &&
    passwordsMatch &&
    validEmail;

  const check: boolean[] = [
    true, //0 ( login page is always done)
    namePageDone, //1 name input
    true, //2 ( position page has a default input so it is always done)
    createAccountPageDone, //3 create account
  ];

  const onLoginClick = (): void => {
    auth.clearError();
    auth.login(email, password, rememberMe);
  };

  const onSignUpClick = (): void => {
    auth.clearError();
    auth.signup(firstName, lastName, email, position, password);
  };

  const pages = [
    <LoginPageMain
      key={0}
      onEmailChange={handleEmail}
      onPasswordChange={handlePassword}
      currEmail={email}
      currPassword={password}
      pageNumber={currentPage}
      currRememberMe={rememberMe}
      onRememberMeChange={handleRememberMe}
      changePage={handlePage}
      onLoginClick={onLoginClick}
      error={auth.error}
    ></LoginPageMain>,
    <LoginNameInput
      key={1}
      onFirstNameChange={handleFirstName}
      onLastNameChange={handleLastName}
      currFirstName={firstName}
      currLastName={lastName}
    ></LoginNameInput>,
    <LoginPositionInput
      key={2}
      onContentChange={handlePosition}
      currPosition={position}
    ></LoginPositionInput>,
    <CreateEmailAndPassword
      key={3}
      onNewEmailChange={handleEmail}
      onNewPasswordChange={handlePassword}
      onConfirmPasswordChange={handleConfirmPassword}
      currNewEmail={email}
      currNewPassword={password}
      currConfirmPassword={confirmPassword}
      passwordLengthOk={passwordLengthOk}
      passwordsMatch={passwordsMatch}
      validEmail={validEmail}
      error={auth.error}
    ></CreateEmailAndPassword>,
  ];

  return (
    <div>
      {pages[currentPage]}
      {currentPage > 0 && (
        <LoginPageNavigation
          onPageChange={handlePage}
          onSignUpClick={onSignUpClick}
          currPage={currentPage}
          completedPages={check}
        ></LoginPageNavigation>
      )}
    </div>
  );
};

export default Login;
