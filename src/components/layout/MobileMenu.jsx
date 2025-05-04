import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

/**
 * Mobile navigation menu with hamburger toggle
 *
 * @param {Object} props - Component props
 * @param {Array} props.items - Navigation items
 * @param {Function} props.onAccountClick - Handler for account button click
 * @param {Object} props.activeAccount - Active wallet account
 */
const MobileMenu = ({ items, onAccountClick, activeAccount }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".mobile-menu")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle navigation item click (close menu after click)
  const handleItemClick = (onClick) => {
    setIsOpen(false);
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="mobile-menu relative">
      {/* Hamburger button */}
      <button
        type="button"
        className="group flex h-6 w-6 items-center gap-2 rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10 dark:hover:ring-white/20"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div
          className={`${
            isOpen ? "hamburger-toggle" : ""
          } flex h-6 w-6 items-center`}
        >
          <div className="h-0.5 w-5 bg-zinc-200 transition">
            <div className="h-0.5 w-5 -translate-y-1.5 bg-zinc-200 transition-all"></div>
            <div className="h-0.5 w-5 translate-y-1.5 bg-zinc-200 transition-all"></div>
          </div>
        </div>
      </button>

      {/* Mobile navigation overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-800/40 backdrop-blur-sm dark:bg-black/80">
          <div className="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-white p-8 ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-zinc-800">
            <div className="flex flex-row-reverse items-center justify-between">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="-m-1 p-1"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-6 w-6 text-zinc-500 dark:text-zinc-400"
                >
                  <path
                    d="m17.25 6.75-10.5 10.5M6.75 6.75l10.5 10.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </button>
              <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Navigation
              </h2>
            </div>
            <nav className="mt-6">
              <ul className="-my-2 divide-y divide-zinc-100 text-base text-zinc-800 dark:divide-zinc-100/5 dark:text-zinc-300">
                {items.map((item, index) => {
                  // Skip items that shouldn't be shown
                  if (item.show === false) return null;

                  if (item.external) {
                    return (
                      <li key={index}>
                        <a
                          href={item.href}
                          className="block py-2"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsOpen(false)}
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
                          className="block w-full py-2 text-left"
                          onClick={() => handleItemClick(item.onClick)}
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
                        className="block py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
