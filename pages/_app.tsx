import "../styles/app.css";
import "../styles/globals.css";
import { AppProps } from "next/app";
import { APIProvider } from "../context/APIContext";
import Layout from "../components/layouts/Layout";
import { AuthProvider } from "../context/AuthContext";
import { AuthGuard } from "../components/Login/RouteGaurd";
import { NextPage } from "next";
import { Component } from "react";

export type NextApplicationPage<P = any, IP = P> = NextPage<P, IP> & {
  requireAuth?: boolean
}

function MyApp(props: AppProps) {
  const {
    Component,
    pageProps,
  }: { Component: NextApplicationPage; pageProps: any } = props


  return (
    <APIProvider>
      <AuthProvider>
        {Component.requireAuth ? (
          <AuthGuard>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </AuthGuard>
        ) : (
          <Component {...pageProps} />
        )}
      </AuthProvider>
    </APIProvider>

  );
}

export default MyApp;
