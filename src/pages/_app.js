import { useEffect, useState } from "react";
import * as Ably from "ably";
import { AblyProvider } from "ably/react";
import "../app/globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SessionProvider, getSession } from "next-auth/react";
import Layout from "../app/layout";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [session2, setSession] = useState(null);
  useEffect(() => {
    async function loadSession() {
      const sessionData = await getSession();
      setSession(sessionData);
    }

    loadSession();
  }, []);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  // `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/createAblyToken`
  // Ably client configuration using authCallback with absolute URL
  // console.log("sesiaaaaaaaa:", session);
  const ablyClient = new Ably.Realtime({
    clientId: session2 ? session2.user.id : "anonymous",
    authCallback: async (tokenParams, callback) => {
      try {
        const response = await fetch(`/api/createAblyToken`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ clientId: tokenParams.clientId }),
        });

        if (response.ok) {
          const tokenRequest = await response.json();
          callback(null, tokenRequest);
        } else {
          callback("Failed to obtain token request", null);
        }
      } catch (error) {
        callback(error, null);
      }
    },
  });
  return (
    <AblyProvider client={ablyClient}>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} ably={ablyClient} />
        </Layout>
      </SessionProvider>
    </AblyProvider>
  );
}

export default MyApp;
