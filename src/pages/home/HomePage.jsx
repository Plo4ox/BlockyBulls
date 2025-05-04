// src/pages/home/Home.jsx

import React from "react";
import OptimizedImage from "../../components/ui/OptimizedImage";
import { getNFTImageUrl } from "../../lib/utils/imageUtils";
import ArticleLinkCard from "./ArticleLinkCard";
import ForSaleSection from "./ForSaleSection";
import ProjectCard from "./ProjectCard";

/**
 * Home page component showing key information about BlockyBulls
 */
export default function Home() {
  // Featured NFTs to display in the hero section
  const featuredNFTs = [1, 2, 3, 4, 5];

  // Articles to feature
  const featuredArticles = [
    {
      title: "The Launch Story",
      date: "June 1st, 2024",
      url: "https://mirror.xyz/blockybulls.eth/6-H05mKkuBsZJNU2YJ6IppRVEYk36-KSQCOzVA-BKYQ",
      description:
        "Discover the origin story of BlockyBulls and why half of the collection has been burnt.",
    },
    {
      title: "Building Bullish Sea",
      date: "October 7th, 2024",
      url: "https://mirror.xyz/blockybulls.eth/IcO1WsZRpO5A7c_00wd4r4IKGm-SXJM8Vo79wq9ldQg",
      description: "Building week after week until we make it!",
    },
  ];

  // Featured projects in the BBverse
  const featuredProjects = [
    {
      name: "Based Snout",
      description: "Generate unique Snout NFTs based on your Ethereum address",
      image: "/basedsnout_project.png",
      link: "/bbverse/basedSnout/",
    },
    {
      name: "BlockyBulls Builder",
      description:
        "Create your own unique BlockyBull by combining different existing attributes!",
      image: "/blockybulls-builder.png",
      link: "/bbverse/blockybulls-builder/",
    },
    {
      name: "Reveal The Bull",
      description: "A new way of discovering the BlockyBulls collection",
      image: "/reveal-the-bull.png",
      link: "/bbverse/reveal-the-bull/",
    },
    {
      name: "Polls",
      description: "Participate in polls",
      image: "/bull-poll.png",
      link: "/bbverse/polls/",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="mt-9 sm:px-8">
        <div className="mx-auto w-full max-w-7xl lg:px-8">
          <div className="relative px-4 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-2xl lg:max-w-5xl">
              <OptimizedImage
                src="/0.png"
                alt="BlockyBull"
                className="h-16 w-16"
                shape="circle"
              />
              <div className="max-w-2xl">
                <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                  BlockyBulls
                  <br />
                  The PFP Based & Bullish.
                </h1>
                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                  A herd of 5.5k unique pixelated bull PFPs (profile pictures)
                  in a classic 16x16 format.
                  <br />
                  This NFT collection is inspired by collections like{" "}
                  <a
                    className="cursor-pointer transition hover:text-blue-500"
                    href="https://cryptopunks.app/"
                  >
                    CryptoPunks
                  </a>{" "}
                  and{" "}
                  <a
                    className="cursor-pointer transition hover:text-blue-500"
                    href="https://bullieverse.com/"
                  >
                    Citizens of Bulliever Island
                  </a>
                  .<br />
                  <br />
                  0% Fees, No Roadmap, only a <b>bullish spirit!</b>
                  <br />
                  But who knows what can happen when 5,5k bulls join forces.
                  <br />
                  <br />
                  Released under{" "}
                  <a
                    className="cursor-pointer transition hover:text-blue-500"
                    href="https://creativecommons.org/publicdomain/zero/1.0/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CC0 license
                  </a>{" "}
                  - completely free for any use.
                  <br />
                </p>
                <div className="mt-6 flex gap-6">
                  <SocialLink
                    href="https://x.com/BlockyBulls"
                    label="Follow on X"
                    icon="x"
                  />
                  <SocialLink
                    href="https://warpcast.com/blockybulls"
                    label="Follow on Warpcast"
                    icon="warpcast"
                  />
                  <SocialLink
                    href="https://opensea.io/collection/blockybulls"
                    label="Buy one on OpenSea"
                    icon="opensea"
                  />
                  <SocialLink
                    href="https://discord.com/invite/4VZNyVEgsr"
                    label="Join the community Discord"
                    icon="discord"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured NFTs Carousel */}
      <section className="mt-16 sm:mt-20">
        <div className="-my-4 flex justify-center gap-5 overflow-hidden py-4 sm:gap-8">
          {featuredNFTs.map((id, index) => {
            const imageUrl = getNFTImageUrl("blockybulls", id, {
              size: "medium",
            });

            return (
              <OptimizedImage
                key={id}
                src={imageUrl}
                alt={`BlockyBull #${id}`}
                className={`relative aspect-square w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 sm:w-72 sm:rounded-2xl ${
                  id % 2 === 0 ? "-rotate-2" : "rotate-2"
                }`}
                shape="square"
              />
            );
          })}
        </div>
      </section>

      {/* Marketplace Sections */}
      <section className="mb-8 mt-16 sm:px-8">
        <div className="mx-auto w-full max-w-7xl lg:px-8">
          <div className="relative px-4 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-2xl lg:max-w-5xl">
              <ForSaleSection />
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="mb-8 mt-16 sm:px-8">
        <div className="mx-auto w-full max-w-7xl lg:px-8">
          <div className="relative px-4 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-2xl lg:max-w-5xl">
              <h2 className="mb-4 text-3xl font-bold">Learn More</h2>
              <p className="mb-6 text-base text-zinc-600 dark:text-zinc-400">
                Discover about the BlockyBulls Project by reading the weekly
                articles posted on{" "}
                <a
                  className="group -m-1 cursor-pointer p-1 hover:text-blue-500"
                  aria-label="Mirror Articles"
                  href="https://mirror.xyz/blockybulls.eth"
                >
                  Mirror
                </a>
                .
              </p>
              <div className="flex flex-col gap-6 md:flex-row">
                {featuredArticles.map((article, index) => (
                  <ArticleLinkCard
                    key={index}
                    title={article.title}
                    date={article.date}
                    src={article.url}
                    description={article.description}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BBverse Projects Section */}
      <section className="mb-16 mt-16 sm:px-8">
        <div className="mx-auto w-full max-w-7xl lg:px-8">
          <div className="relative px-4 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-2xl lg:max-w-5xl">
              <h2 className="mb-4 text-3xl font-bold">Explore the BBverse</h2>
              <p className="mb-6 text-base text-zinc-600 dark:text-zinc-400">
                Explore the BBverse and discover exciting projects that extend
                the BlockyBulls experience.
                <br />
                From NFTs background customization to interactive tools, there's
                always something to try.
              </p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {featuredProjects.map((project, index) => (
                  <ProjectCard
                    key={index}
                    name={project.name}
                    description={project.description}
                    image={project.image}
                    link={project.link}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Social media icon link component
function SocialLink({ href, label, icon }) {
  return (
    <a
      className="group -m-1 cursor-pointer p-1"
      aria-label={label}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <SocialIcon icon={icon} />
    </a>
  );
}

// Renders the appropriate social media icon
function SocialIcon({ icon }) {
  switch (icon) {
    case "x":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300"
        >
          <path d="M14.095479,10.316482L22.286354,1h-1.940718l-7.115352,8.087682L7.551414,1H1l8.589488,12.231093L1,23h1.940717  l7.509372-8.542861L16.448587,23H23L14.095479,10.316482z M11.436522,13.338465l-0.871624-1.218704l-6.924311-9.68815h2.981339  l5.58978,7.82155l0.867949,1.218704l7.26506,10.166271h-2.981339L11.436522,13.338465z" />
        </svg>
      );
    case "warpcast":
      return (
        <svg
          width="24"
          height="22"
          viewBox="0 0 323 297"
          fill="none"
          className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300"
        >
          <path d="M55.5867 0.733337H263.413V296.267H232.907V160.893H232.607C229.236 123.479 197.792 94.16 159.5 94.16C121.208 94.16 89.7642 123.479 86.3926 160.893H86.0933V296.267H55.5867V0.733337Z" />
          <path d="M0.293335 42.68L12.6867 84.6267H23.1733V254.32C17.9082 254.32 13.64 258.588 13.64 263.853V275.293H11.7333C6.46822 275.293 2.2 279.562 2.2 284.827V296.267H108.973V284.827C108.973 279.562 104.705 275.293 99.44 275.293H97.5333V263.853C97.5333 258.588 93.2651 254.32 88 254.32H76.56V42.68H0.293335Z" />
          <path d="M234.813 254.32C229.548 254.32 225.28 258.588 225.28 263.853V275.293H223.373C218.108 275.293 213.84 279.562 213.84 284.827V296.267H320.613V284.827C320.613 279.562 316.345 275.293 311.08 275.293H309.173V263.853C309.173 258.588 304.905 254.32 299.64 254.32V84.6267H310.127L322.52 42.68H246.253V254.32H234.813Z" />
        </svg>
      );
    case "opensea":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 360 360"
          fill="none"
          className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300"
        >
          <path d="M181.566 1.00604e-05C80.91 -0.82799 -0.82799 80.91 1.00604e-05 181.566C0.84601 279.306 80.694 359.172 178.416 359.982C279.072 360.846 360.846 279.072 359.982 178.416C359.172 80.712 279.306 0.84601 181.566 1.00604e-05ZM127.746 89.586C139.266 104.22 146.16 122.742 146.16 142.83C146.16 160.236 140.994 176.436 132.12 189.954H69.714L127.728 89.568L127.746 89.586ZM318.006 199.242V212.202C318.006 213.048 317.556 213.768 316.782 214.092C312.552 215.892 298.602 222.372 292.788 230.436C277.812 251.28 266.382 284.04 240.822 284.04H134.172C96.408 284.04 64.818 254.07 64.836 214.146C64.836 213.156 65.682 212.346 66.672 212.346H117.216C118.962 212.346 120.33 213.75 120.33 215.46V225.216C120.33 230.4 124.524 234.612 129.726 234.612H168.066V212.292H141.876C156.942 193.212 165.906 169.128 165.906 142.902C165.906 113.652 154.692 86.976 136.332 67.032C147.438 68.328 158.058 70.542 168.066 73.476V67.266C168.066 60.822 173.286 55.602 179.73 55.602C186.174 55.602 191.394 60.822 191.394 67.266V82.242C227.178 98.946 250.614 126.666 250.614 158.022C250.614 176.418 242.568 193.536 228.69 207.936C226.026 210.69 222.336 212.256 218.466 212.256H191.412V234.54H225.378C232.704 234.54 245.844 220.644 252.072 212.274C252.072 212.274 252.342 211.86 253.062 211.644C253.782 211.428 315.432 197.28 315.432 197.28C316.728 196.92 318.006 197.91 318.006 199.224V199.242Z" />
        </svg>
      );
    case "telegram":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 16 16"
          className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300"
        >
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09" />
        </svg>
      );
    case "discord":
      return (
        <svg
          viewBox="0 0 127.14 96.36"
          height="18"
          width="24"
          className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300"
        >
          <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
        </svg>
      );
    default:
      return null;
  }
}
