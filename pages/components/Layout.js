import Head from "next/head";
import Navbar from "./Navbar";

const Layout = ({ children, title = "Just a wonderful app | peace and love" }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="d list app all items in one place" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default Layout;
