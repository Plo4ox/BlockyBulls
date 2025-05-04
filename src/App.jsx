import BurgerMenu from "./components/layout/BurgerMenu";
import { Outlet, Link } from "react-router-dom";
import { useActiveAccount } from "thirdweb/react";
import { useNavigate, useLocation } from "react-router-dom";
import { ConnectButton } from "thirdweb/react";
import client from "./lib/client";
import { wallets } from "./lib/wallets";

export default function App() {
  const activeAccount = useActiveAccount();
  const navigate = useNavigate();
  const location = useLocation();
  const root = window.document.documentElement;
  root.classList.add("dark");

  const handleConnect = (address) => {
    console.log("Wallet successfully connected.");
  };

  const handleError = (error) => {
    console.log("Unable to connect wallet.");
  };

  async function onMeSelected() {
    navigate(`/account/${activeAccount.address}`, { relative: false });
  }

  async function onHomeSelected() {
    navigate("/", { relative: false });
  }

  return (
    <div className="min-h-screen w-screen bg-black">
      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="ring-dark-300/50 w-full bg-black ring-2 ring-zinc-900"></div>
        </div>
      </div>
      <header className="relative z-50 flex flex-none flex-col">
        <div className="top-0 z-10 h-16 pt-6">
          <div className="top-[var(--header-top,theme(spacing.6))] w-full sm:px-8">
            <div className="mx-auto w-full max-w-7xl lg:px-8">
              <div className="relative px-4 sm:px-8 lg:px-12">
                <div className="mx-auto max-w-2xl lg:max-w-5xl">
                  <div className="relative flex gap-4">
                    <div className="flex flex-1">
                      {location.pathname != "/" ? (
                        <a
                          onClick={onHomeSelected}
                          className="flex h-full items-center justify-center opacity-80 transition-opacity duration-300 hover:opacity-100"
                        >
                          <img
                            className="m-auto h-10 w-10 rounded-full"
                            src="/0.png"
                            alt="Rounded avatar"
                          />
                        </a>
                      ) : (
                        <div />
                      )}
                    </div>

                    <div className="flex flex-1 justify-end md:justify-center">
                      <div className="pointer-events-auto md:hidden">
                        <BurgerMenu
                          onMeSelected={onMeSelected}
                          activeAccount={activeAccount}
                        />
                      </div>

                      <nav className="pointer-events-auto hidden md:block">
                        <ul className="flex h-full items-center rounded-xl bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-black dark:text-zinc-200 dark:ring-white/10">
                          <li>
                            <a
                              className="relative block px-3 py-2 transition hover:text-blue-500"
                              href="https://mirror.xyz/blockybulls.eth"
                            >
                              Articles
                            </a>
                          </li>
                          <li>
                            <Link
                              to="collections/"
                              className="relative block px-3 py-2 transition hover:text-blue-500"
                            >
                              Collections
                            </Link>
                          </li>
                        </ul>
                      </nav>
                    </div>

                    <div className="flex min-w-fit flex-1 justify-end">
                      <ConnectButton
                        client={client}
                        wallets={wallets}
                        theme={"dark"}
                        onConnect={handleConnect}
                        onError={handleError}
                        connectModal={{
                          size: "compact",
                          titleIconUrl: "/logo.svg",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Outlet />

      <footer className="flex-none">
        <div className="sm:px-8">
          <div className="mx-auto w-full max-w-7xl lg:px-8">
            <div className="relative border-t-2 border-zinc-100 pb-16 pt-10 dark:border-zinc-700/40">
              <div className="relative px-4 sm:px-8 lg:px-12">
                <div className="mx-auto max-w-2xl lg:max-w-5xl">
                  <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                      <a
                        className="transition hover:text-blue-500"
                        href="https://mirror.xyz/blockybulls.eth"
                      >
                        Articles
                      </a>
                      <Link
                        to="collections/"
                        className="transition hover:text-blue-500"
                      >
                        Collections
                      </Link>
                    </div>
                    <p className="text-sm text-zinc-400 dark:text-zinc-500">
                      Stay Bullish Always!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
