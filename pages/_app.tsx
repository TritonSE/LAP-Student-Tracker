import React from "react";
import "../styles/app.css";
import "../styles/globals.css";
import { AppProps } from "next/app";
import { APIProvider } from "../context/APIContext";
import { Layout } from "../components/layouts/Layout";
// import { Navbar } from "../components/Navbar";
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
        < Layout>
          {Component.requireAuth ? (
            <AuthGuard>
              <Component {...pageProps} />
            </AuthGuard>
          ) : (
            <Component {...pageProps} />
          )}
        </Layout>
      </AuthProvider>
    </APIProvider>

  );
}

export default MyApp;
