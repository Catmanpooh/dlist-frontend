import "../styles/globals.css";
import WalletContext from "../context/WalletContext";
import { Wallet } from "../lib/near-wallet";
import { useState, useEffect } from "react";

const CONTRACT_ADDRESS = process.env.CONTRACT_NAME;

// When creating the wallet you can optionally ask to create an access key
// Having the key enables to call non-payable methods without interrupting the user to sign
const wallet = new Wallet({ createAccessKeyFor: CONTRACT_ADDRESS });

function MyApp({ Component, pageProps }) {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    async function checkSignedIn() {
      setIsSignedIn(await wallet.startUp());
    }
    checkSignedIn();
  });

  return (
    <>
      <WalletContext.Provider
        value={{ wallet: wallet, isSignedIn: isSignedIn }}
      >
        <Component {...pageProps} />
      </WalletContext.Provider>
    </>
  );
}

export default MyApp;
