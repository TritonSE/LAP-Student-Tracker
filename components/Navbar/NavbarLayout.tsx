import React from "react";
import { useRouter } from "next/router";
import { Navbar } from "./Navbar";
import Home from "../../pages/home";
//using Layout to render the Navbar on select pages
const Layout: React.FC = ({ children }) => {
  const router = useRouter();
  const hideNavbar = ["/login", "/signup", "/forgotpassword", "/resetpassword"];
  const showNavbar = hideNavbar.includes(router.pathname) ? false : true;
  const showHome = router.pathname.includes("/home") ? true : false;
  return (
    <div>
      {showNavbar && <Navbar />}
      {showHome && <Home />}
      {children}
    </div>
  );
};
export { Layout };
