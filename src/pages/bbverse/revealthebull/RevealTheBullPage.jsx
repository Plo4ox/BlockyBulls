import React, { useState, useEffect } from "react";
import RevealTheBull from "./RevealTheBull";
import backgrounds from "../../../lib/data/backgrounds.json";
import mergeImages from "merge-images";

export default function RevealTheBullPage() {
  const [mergedImage, setMergedImage] = useState(null);
  const [random, setRandom] = useState(Math.floor(Math.random() * 5499 + 1));

  useEffect(() => {
    const mergeImagesfct = async () => {
      const background = backgrounds[random - 1];

      var imageUrls = [`/bb/bg/${background}.png`, `/bb/nobg/${random}.png`];
      const images = await Promise.all(imageUrls.map((url) => fetch(url)));
      const blobs = await Promise.all(
        images.map((response) => response.blob())
      );
      const mergedImage = await mergeImages(
        blobs.map((blob) => URL.createObjectURL(blob))
      );
      setMergedImage(mergedImage);
    };

    mergeImagesfct();
  }, [random]);

  return (
    <div className="mb-8 mt-16 sm:px-8">
      <div className="mx-auto w-full max-w-7xl lg:px-8">
        <div className="relative px-4 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl lg:max-w-5xl">
            <header className="max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                Reveal The BlockyBull
              </h1>
              <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                This interactive feature allows you to gradually unveil a
                BlockyBull NFT, starting from a single circle.
                <br />
                Just hover it!
                <br />
                Based on the idea of{" "}
                <a
                  href={`https://www.koalastothemax.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Koalastothemax
                </a>
              </p>
            </header>
            <div className="mt-16 flex justify-center">
              <RevealTheBull imgSrc={mergedImage} />
            </div>
            <div className="centered-container mt-10">
              <button
                onClick={() => {
                  setRandom(Math.floor(Math.random() * 5499 + 1));
                }}
                type="button"
                className="text-white-400 mb-2 me-2 mt-2 w-44 rounded-lg border border-blue-200 border-blue-600 bg-blue-800 px-5 py-2.5 text-sm font-medium hover:bg-blue-700 hover:text-white focus:z-10 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:ring-blue-700 sm:w-72"
              >
                Shuffle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
