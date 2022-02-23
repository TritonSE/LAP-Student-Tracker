import React from "react";
import "../styles/app.css";
import "../styles/globals.css";
import { AppProps } from "next/app";
import { Layout } from "../components/layouts/Layout";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export { MyApp };
