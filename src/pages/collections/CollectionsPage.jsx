import React from "react";
import { useNavigate } from "react-router-dom";

const collections = [
  {
    name: "BlockyBulls",
    description:
      "A herd of 5,500 unique pixelated bull PFPs in a classic 16x16 format.",
    image: "/bb_project.jpeg",
    link: "/collection/BlockyBulls/explorer",
  },
  {
    name: "BasedSnout",
    description:
      "Unique Snout NFTs based on Ethereum addresses. Where bullish vibes meet blockchain art!",
    image: "/basedsnout_project.png",
    link: "/collection/BasedSnout/explorer",
  },
  {
    name: "BeyondTheBlock",
    description:
      "Special edition NFTs extending the BlockyBulls universe. Planned to be used in a small game.",
    image: "/btb_project.png",
    link: "/collection/BeyondTheBlock/explorer",
  },
  {
    name: "Honorary",
    description:
      "Exclusive Honorary NFTs representing people who shows bullish vibes everyday! Based on 𝕏 PFPs.",
    image: "/honorary_project.png",
    link: "/collection/Honorary/explorer",
  },
];

const CollectionsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-8 mt-16 sm:px-8">
      <div className="mx-auto w-full max-w-7xl lg:px-8">
        <div className="relative px-4 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl lg:max-w-5xl">
            <h1 className="mb-4 text-4xl font-bold">BlockyBulls Collections</h1>
            <p className="mb-6 text-base text-zinc-600 dark:text-zinc-400">
              Explore the diverse range of NFT collections.
              <br />
              Each collection is part of the BlockyBulls universe.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {collections.map((collection, index) => (
                <div
                  key={index}
                  className="group relative flex cursor-pointer flex-col items-start overflow-hidden rounded-lg border border-zinc-200 transition-all duration-300 hover:border-blue-500 hover:shadow-md dark:border-zinc-700"
                  onClick={() => navigate(collection.link)}
                >
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-6">
                    <h2 className="mb-2 text-xl font-semibold text-zinc-800 group-hover:text-blue-500 dark:text-zinc-100">
                      {collection.name}
                    </h2>
                    <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {collection.description}
                    </p>
                    <div
                      aria-hidden="true"
                      className="relative z-10 mt-auto flex items-center text-sm font-medium text-blue-500 group-hover:underline"
                    >
                      Explore
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                        className="ml-1 h-4 w-4 stroke-current"
                      >
                        <path
                          d="M6.75 5.75 9.25 8l-2.5 2.25"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;
