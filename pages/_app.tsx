import "../styles/app.css";
import "../styles/globals.css";
import { AppProps } from "next/app";
import { APIProvider } from "../context/APIContext";
import Layout from "../components/layouts/Layout";
import { AuthProvider } from "../context/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <APIProvider>
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </APIProvider>

  );
}

export default MyApp;
