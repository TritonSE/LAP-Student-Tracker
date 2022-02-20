import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import styles from "../styles/Login.module.css";
import LoginPageMain from "../components/Login/LoginPageMain";
import LoginNameInput from "../components/Login/LoginNameInput";
import LoginPositionInput from "../components/Login/LoginPositionInput";
import CreatePassword from "../components/Login/CreatePassword";

const Login: NextPage = () => {
    
    return <CreatePassword />;
}

export default Login;