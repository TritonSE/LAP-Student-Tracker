import type { NextPage } from "next";
import { AuthContext } from "../context/AuthContext";
import Head from "next/head";
import Image from "next/image";
import { useContext } from "react";

//This is the page that is rendered when the 'Profile' button from the Navbar is clicked
const Profile: NextPage = () => {
  return <h1>PROFILE</h1>;
};
export default Profile;
