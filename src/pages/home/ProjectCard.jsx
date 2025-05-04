import React from "react";
import { Link } from "react-router-dom";
import OptimizedImage from "../../components/ui/OptimizedImage";

const ProjectCard = ({ name, description, image, link, onClick }) => {
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Link
      to={link}
      className="group relative flex cursor-pointer flex-col items-start overflow-hidden rounded-lg border border-zinc-200 transition-all duration-300 hover:border-blue-500 hover:no-underline hover:shadow-md dark:border-zinc-700"
      onClick={handleClick}
    >
      <div className="h-40 w-full overflow-hidden">
        <OptimizedImage
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="mb-2 text-xl font-semibold text-zinc-800 group-hover:text-blue-500 dark:text-zinc-100">
          {name}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
        <div
          aria-hidden="true"
          className="relative z-10 mt-4 flex items-center text-sm font-medium text-blue-500 group-hover:underline"
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
    </Link>
  );
};

export default ProjectCard;
