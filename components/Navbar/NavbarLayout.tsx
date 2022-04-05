import React from "react";
import { useRouter } from "next/router";
import { Navbar } from "./Navbar";
//using Layout to render the Navbar on select pages
const Layout: React.FC = ({ children }) => {
  const router = useRouter();
  const hideNavbar = ["/login", "/signup", "/forgotpassword", "/resetpassword"];
  const showNavbar = hideNavbar.includes(router.pathname) ? false : true;
  return (
    <div>
      {showNavbar && <Navbar />}
      {children}
    </div>
  );
};
export { Layout };
