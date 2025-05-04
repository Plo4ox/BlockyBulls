import React from "react";
import App from "../App.jsx";
import HomePage from "../pages/home/HomePage.jsx";
import BlockyBullsBuilderPage from "../pages/bbverse/blockybullsbuilder/BlockyBullsBuilderPage.jsx";
import RevealTheBullPage from "../pages/bbverse/revealthebull/RevealTheBullPage.jsx";
import BasedSnoutPage from "../pages/bbverse/basedsnout/BasedSnoutPage.jsx";
import CollectionsPage from "../pages/collections/CollectionsPage.jsx";
import BlockyBullsPollsPage from "../pages/bbverse/polls/BlockyBullsPollsPage.jsx";
import BlockyBullsAttributesPage from "../pages/collections/blockybulls/BlockyBullsAttributesPage.jsx";
import BlockyBullsExplorerPage from "../pages/collections/blockybulls/BlockyBullsExplorerPage.jsx";
import HonoraryExplorerPage from "../pages/collections/honorary/HonoraryExplorerPage.jsx";
import BeyondTheBlockExplorerPage from "../pages/collections/beyondtheblock/BeyondTheBlockExplorerPage.jsx";
import BasedSnoutExplorerPage from "../pages/collections/basedsnout/BasedSnoutExplorerPage.jsx";
import NFTDetailsPage from "../pages/nft/NFTDetailsPage.jsx";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route
            path="bbverse/blockybulls-builder/"
            element={<BlockyBullsBuilderPage />}
          />
          <Route
            path="bbverse/reveal-the-bull/"
            element={<RevealTheBullPage />}
          />
          <Route path="bbverse/basedSnout/" element={<BasedSnoutPage />} />
          <Route path="bbverse/polls" element={<BlockyBullsPollsPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route
            path="/collection/BlockyBulls/attributes"
            element={<BlockyBullsAttributesPage />}
          />
          <Route
            path="/collection/BlockyBulls/explorer"
            element={<BlockyBullsExplorerPage />}
          />
          <Route
            path="/collection/Honorary/explorer"
            element={<HonoraryExplorerPage />}
          />
          <Route
            path="/collection/BeyondTheBlock/explorer"
            element={<BeyondTheBlockExplorerPage />}
          />
          <Route
            path="/collection/BasedSnout/explorer"
            element={<BasedSnoutExplorerPage />}
          />
          <Route
            path="/collection/:collection/token/:id"
            element={<NFTDetailsPage />}
          />
          <Route index element={<HomePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
