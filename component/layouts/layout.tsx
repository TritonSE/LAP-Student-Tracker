import { useRouter } from "next/router";
import { Navbar } from "../navbar"
import React, { FC } from "react";


const Layout: React.FC = ({ children }) => {
    const router = useRouter();
    const hideNavbar = ['/login', '/signup', '/home'];
    const showNavbar = hideNavbar.includes(router.pathname) ? false : true;
    return (
        <div>
            {showNavbar && <Navbar />}
            {children}
        </div>
    );
}
export default Layout;