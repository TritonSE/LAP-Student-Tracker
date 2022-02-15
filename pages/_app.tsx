import "../styles/app.css";
import "../styles/globals.css";
import { AppProps } from "next/app";
import { APIProvider } from './context/APIContext';
import Layout from "../components/layouts/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <APIProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </APIProvider>
  );
}

export default MyApp;
