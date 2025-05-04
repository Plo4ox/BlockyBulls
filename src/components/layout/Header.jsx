import React from "react";
import { Link } from "react-router-dom";
import { ConnectButton } from "thirdweb/react";
import client from "../../lib/client";
import { wallets } from "../../lib/wallets";
import MobileMenu from "./MobileMenu";
import OptimizedImage from "../ui/OptimizedImage";

const Header = ({
  activeAccount,
  onHomeClick,
  onAccountClick,
  currentPath,
}) => {
  const navigationItems = [
    {
      name: "Articles",
      href: "https://mirror.xyz/blockybulls.eth",
      external: true,
    },
    { name: "Collections", href: "/collections", external: false },
  ];

  // Handle wallet connection
  const handleConnect = () => {
    console.log("Wallet successfully connected.");
  };

  // Handle wallet connection error
  const handleError = (error) => {
    console.error("Unable to connect wallet:", error);
  };

  return (
    <header className="relative z-50 flex flex-none flex-col">
      <div className="top-0 z-10 h-16 pt-6">
        <div className="top-[var(--header-top,theme(spacing.6))] w-full sm:px-8">
          <div className="mx-auto w-full max-w-7xl lg:px-8">
            <div className="relative px-4 sm:px-8 lg:px-12">
              <div className="mx-auto max-w-2xl lg:max-w-5xl">
                <div className="relative flex gap-4">
                  {/* Logo/Home button */}
                  <div className="flex flex-1">
                    {currentPath !== "/" && (
                      <button
                        onClick={onHomeClick}
                        className="h-10 w-10 rounded-full opacity-80 transition-opacity duration-300 hover:opacity-100"
                      >
                        <OptimizedImage
                          src="/0.png"
                          alt="BlockyBulls"
                          className="h-full w-full"
                          shape="circle"
                        />
                      </button>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex flex-1 justify-end md:justify-center">
                    {/* Mobile menu button */}
                    <div className="pointer-events-auto md:hidden">
                      <MobileMenu
                        items={navigationItems}
                        onAccountClick={onAccountClick}
                        activeAccount={activeAccount}
                      />
                    </div>

                    {/* Desktop navigation */}
                    <nav className="pointer-events-auto hidden md:block">
                      <ul className="flex h-full items-center rounded-xl bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-black dark:text-zinc-200 dark:ring-white/10">
                        {navigationItems.map((item, index) => {
                          if (item.show === false) return null;

                          if (item.external) {
                            return (
                              <li key={index}>
                                <a
                                  className="relative block px-3 py-2 transition hover:text-blue-500"
                                  href={item.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {item.name}
                                </a>
                              </li>
                            );
                          }

                          if (item.onClick) {
                            return (
                              <li key={index}>
                                <button
                                  onClick={item.onClick}
                                  className="relative block px-3 py-2 transition hover:text-blue-500"
                                >
                                  {item.name}
                                </button>
                              </li>
                            );
                          }

                          return (
                            <li key={index}>
                              <Link
                                to={item.href}
                                className="relative block px-3 py-2 transition hover:text-blue-500"
                              >
                                {item.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </nav>
                  </div>

                  {/* Wallet connection */}
                  <div className="flex min-w-fit flex-1 justify-end">
                    <ConnectButton
                      client={client}
                      wallets={wallets}
                      theme="dark"
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
  );
};

export default Header;
