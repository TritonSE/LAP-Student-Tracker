import '../styles/app.css'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Navbar } from "../components/navbar"
import Layout from "../components/layouts/layout"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>


  )
}

export default MyApp
