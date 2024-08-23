import "../app/globals.css";
import "slick-carousel/slick/slick.css"; // Default styling for slick
import "slick-carousel/slick/slick-theme.css"; // Optional theme for slick
import { SessionProvider } from "next-auth/react";
import Layout from "../app/layout";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;
