/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import "../styles/app.css";
import "../styles/globals.css";
import { AppProps } from "next/app";
import { APIProvider } from "../context/APIContext";
import { Layout } from "../components/Navbar/NavbarLayout";
import { AuthProvider } from "../context/AuthContext";
import { AuthGuard } from "../components/util/RouteGaurd";
import { NextPage } from "next";
// Importing full calendar css for use within calendar component
import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    palette: {
      primary: {
        main: string;
      };
      secondary: {
        main: string;
      };
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#f37121",
    },
  },
});

export type NextApplicationPage<P = any, IP = P> = NextPage<P, IP> & {
  requireAuth?: boolean;
};

function MyApp(props: AppProps): JSX.Element {
  const { Component, pageProps }: { Component: NextApplicationPage; pageProps: any } = props;

  return (
    <APIProvider>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <Layout>
            {Component.requireAuth ? (
              <AuthGuard>
                <Component {...pageProps} />
              </AuthGuard>
            ) : (
              <Component {...pageProps} />
            )}
          </Layout>
        </ThemeProvider>
      </AuthProvider>
    </APIProvider>
  );
}

export default MyApp;
