import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Navbar } from "/Users/zainkhan/LAP-Student-Tracker/component/navbar"

function MyApp({ Component, pageProps }: AppProps) {
  return <Navbar>
    <Component {...pageProps} />
    </Navbar> 
}

export default MyApp
