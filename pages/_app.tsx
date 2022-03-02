import React from "react";
import "../styles/app.css";
import "../styles/globals.css";
import { AppProps } from "next/app";
import { Layout } from "../components/layouts/Layout";
import { APIProvider } from "../context/APIContext";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <APIProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </APIProvider>
  );
}

export default MyApp;
