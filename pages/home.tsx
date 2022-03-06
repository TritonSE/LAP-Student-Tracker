import type { NextPage } from "next";
import type { NextApplicationPage } from "./_app";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
//This is the page that is rendered when the 'Home' button from the Navbar is clicked

const Home: NextApplicationPage = () => {
  // const auth = useContext(AuthContext);
  // const router = useRouter();
  // useEffect(() => {
  //   if (auth.user === null) router.push("/login");
  // })

  return <div>hello</div>;
};

Home.requireAuth = true;



export default Home;
