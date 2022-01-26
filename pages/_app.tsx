import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Navbar } from "../component/navbar"
import { useRouter } from 'next/router'
import Layout from "../component/layouts/layout"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
    <Component {...pageProps} />
    </Layout>
    
   
)
}

export default MyApp