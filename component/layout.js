import { useRouter } from "next/router";
import { Navbar } from "/Users/zainkhan/LAP-Student-Tracker/component/navbar"

const Layout = ({children}) => {
    const router = useRouter();
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