import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useActiveAccount } from "thirdweb/react";
import Header from "./Header";
import Footer from "../common/Footer";

const Layout = ({ children }) => {
  const activeAccount = useActiveAccount();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add("dark");
  }, []);

  // Handle navigation to account page
  const handleAccountNavigation = () => {
    if (activeAccount) {
      navigate(`/account/${activeAccount.address}`);
    }
  };

  // Handle navigation to home page
  const handleHomeNavigation = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen w-screen bg-black">
      {/* Background grid */}
      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="ring-dark-300/50 w-full bg-black ring-2 ring-zinc-900"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative flex min-h-screen flex-col">
        <Header
          activeAccount={activeAccount}
          onHomeClick={handleHomeNavigation}
          onAccountClick={handleAccountNavigation}
          currentPath={location.pathname}
        />

        <main className="flex-grow">{children}</main>

        <Footer
          activeAccount={activeAccount}
          onAccountClick={handleAccountNavigation}
        />
      </div>
    </div>
  );
};

export default Layout;
