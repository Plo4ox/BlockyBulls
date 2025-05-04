import React from "react";

const ArticleLinkCard = ({ title, date, src, description, className = "" }) => {
  return (
    <article
      className={`group relative flex flex-col items-start rounded-lg border border-zinc-200 p-6 transition-all duration-300 hover:border-blue-500 hover:shadow-md dark:border-zinc-700 ${className}`}
    >
      <h2 className="text-base font-semibold tracking-tight text-zinc-800 group-hover:text-blue-500 dark:text-zinc-100">
        <a
          href={src}
          className="hover:text-blue-500 hover:no-underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="absolute inset-0 z-20"></span>
          <span className="relative z-10">{title}</span>
        </a>
      </h2>

      <time className="relative z-10 order-first mb-3 flex items-center text-sm text-zinc-400 dark:text-zinc-500">
        {date}
      </time>

      <p className="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {description}
      </p>

      <div
        aria-hidden="true"
        className="relative z-10 mt-4 flex items-center text-sm font-medium text-blue-500 group-hover:underline"
      >
        Read article
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
    </article>
  );
};

export default ArticleLinkCard;
