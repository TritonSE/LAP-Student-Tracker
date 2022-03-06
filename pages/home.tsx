import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
//This is the page that is rendered when the 'Home' button from the Navbar is clicked
const Home: NextPage = () => {
  const auth = useContext(AuthContext)
  return <div>{auth.user?.firstName}</div>;
};
export default Home;
