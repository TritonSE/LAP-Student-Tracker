import { useRouter } from "next/router";
import { Navbar } from "../Navbar";
import React, { FC, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

//using Layout to render the Navbar on select pages
const Layout: React.FC = ({ children }) => {
  const router = useRouter();
  const auth = useContext(AuthContext)
  //hideNavbar contains urls where the navbar shouldn't be rendered
  // const hideNavbar = ["/login", "/signup"];
  console.log(auth)
  const showNavbar = !auth.loggedIn ? false : true;
  return (
    <div>
      {showNavbar && <Navbar />}
      {children}
    </div>
  );
};
export default Layout;
