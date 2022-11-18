import { useEffect, useContext } from "react";
import WalletContext from "../../context/WalletContext";

import { SignInButton, SignOutButton } from "../../lib/sign-flow";
import { themeChange } from "theme-change";
import { THEMES } from "../../lib/constants";

const Navbar = () => {
  const { wallet, isSignedIn } = useContext(WalletContext);

  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
  }, []);

  return (
    <div className="navbar bg-base-100 my-2">
      <div className="navbar-start">
        <a href="/" className="btn btn-ghost normal-case text-2xl">
          dList
        </a>
      </div>
      <div className="navbar-end">
        <ul className="menu menu-horizontal p-0">
          <li>
            <select className="select w-42 max-w-xs mx-2" data-choose-theme>
              {THEMES.map((theme, i) => {
                return (
                  <option key={i} value={theme}>
                    {theme}
                  </option>
                );
              })}
            </select>
          </li>
          {isSignedIn ? (
            <>
              <li>
                <a className="text-lg font-bold mx-4" href="/post">
                  Post
                </a>
              </li>
              <li>
                <SignOutButton
                  accountId={wallet.accountId}
                  onClick={() => wallet.signOut()}
                />
              </li>
            </>
          ) : (
            <li>
              <SignInButton onClick={() => wallet.signIn()} />
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
