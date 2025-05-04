import React from "react";
import ReactDOM from "react-dom/client";
import { ThirdwebProvider } from "thirdweb/react";
import "./styles/globals.css";
import { Toaster } from "./components/ui/Toaster.tsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import { MarketplaceProvider } from "./contexts/MarketplaceContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThirdwebProvider>
      <MarketplaceProvider>
        <Toaster />
        <AppRoutes />
      </MarketplaceProvider>
    </ThirdwebProvider>
  </React.StrictMode>
);
