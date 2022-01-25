import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Navbar } from "/Users/zainkhan/LAP-Student-Tracker/component/navbar"
import { useRouter } from 'next/router'
import Layout from "/Users/zainkhan/LAP-Student-Tracker/component/layout"

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const showNavbar = (router.pathname === '/login');
  return (
    <Layout>
    <Component {...pageProps} />
    </Layout>
    
   
)
}

export default MyApp