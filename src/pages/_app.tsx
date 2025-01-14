import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";
import SideNav from "~/componets/SideNav";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Outward</title>
      </Head>

      <div className="container mx-auto flex text-start sm:pr-4">
        <SideNav />
        <div className="min-h-screen flex-grow border-x">
          <Component {...pageProps} />
        </div>

      </div>

    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
