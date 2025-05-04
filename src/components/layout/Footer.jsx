import React from "react";
import { Link } from "react-router-dom";

/**
 * Footer component with navigation links
 *
 * @param {Object} props - Component props
 * @param {Object} props.activeAccount - Active wallet account
 * @param {Function} props.onAccountClick - Handler for account button click
 */
const Footer = ({ activeAccount, onAccountClick }) => {
  const navigationItems = [
    {
      name: "Articles",
      href: "https://mirror.xyz/blockybulls.eth",
      external: true,
    },
    { name: "Collections", href: "/collections", external: false },
  ];

  return (
    <footer className="flex-none">
      <div className="sm:px-8">
        <div className="mx-auto w-full max-w-7xl lg:px-8">
          <div className="relative border-t-2 border-zinc-100 pb-16 pt-10 dark:border-zinc-700/40">
            <div className="relative px-4 sm:px-8 lg:px-12">
              <div className="mx-auto max-w-2xl lg:max-w-5xl">
                <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                  <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {navigationItems.map((item, index) => {
                      // Skip items that shouldn't be shown
                      if (item.show === false) return null;

                      if (item.external) {
                        return (
                          <a
                            key={index}
                            className="transition hover:text-blue-500"
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.name}
                          </a>
                        );
                      }

                      if (item.onClick) {
                        return (
                          <button
                            key={index}
                            onClick={item.onClick}
                            className="transition hover:text-blue-500"
                          >
                            {item.name}
                          </button>
                        );
                      }

                      return (
                        <Link
                          key={index}
                          to={item.href}
                          className="transition hover:text-blue-500"
                        >
                          {item.name}
                        </Link>
                      );
                    })}
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
  );
};

export default Footer;
