import { useRouter } from "next/router";
import { Navbar } from "../Navbar"
import React, { FC } from "react";

//using Layout to render the Navbar on select pages
const Layout: React.FC = ({ children }) => {
    const router = useRouter();
    //hideNavbar contains urls where the navbar shouldn't be rendered
    const hideNavbar = ['/login', '/signup'];
    const showNavbar = hideNavbar.includes(router.pathname) ? false : true;
    return (
        <div>
            {showNavbar && <Navbar />}
            {children}
        </div>
    );
}
export default Layout;