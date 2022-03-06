import "../styles/app.css";
import "../styles/globals.css";
import { AppProps } from "next/app";
import { APIProvider } from "../context/APIContext";
import Layout from "../components/layouts/Layout";
import { AuthProvider } from "../context/AuthContext";
import { RouteGuard } from "../components/Login/RouteGaurd";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <APIProvider>
      <AuthProvider>
        {/* <RouteGuard> */}
        <Layout>
          <Component {...pageProps} />
        </Layout>
        {/* </RouteGuard> */}
      </AuthProvider>
    </APIProvider>

  );
}

export default MyApp;
