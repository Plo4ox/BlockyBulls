import React from "react";

// Shape icons
const SquareIcon = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
  </svg>
);

const CircleIcon = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const HexagonIcon = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2 L21.4641 7 L21.4641 17 L12 22 L2.5359 17 L2.5359 7 Z" />
  </svg>
);

/**
 * Maps shape IDs to their respective icons and CSS classes
 */
const SHAPES = {
  square: {
    icon: SquareIcon,
    containerClass: "rounded-lg",
    label: "Square",
  },
  circle: {
    icon: CircleIcon,
    containerClass: "rounded-full",
    label: "Circle",
  },
  hexagon: {
    icon: HexagonIcon,
    containerClass: "mask mask-hexagon",
    label: "Hexagon",
  },
  squircle: {
    icon: SquareIcon,
    containerClass: "mask mask-squircle",
    label: "Squircle",
  },
};

/**
 * Component for selecting the shape display of an NFT
 *
 * @param {Object} props - Component props
 * @param {string} props.currentShape - Currently selected shape
 * @param {Function} props.onChange - Callback when shape is changed
 * @param {Array} props.availableShapes - Optional array of shape IDs to display
 * @param {string} props.size - Optional size variant (small, medium, large)
 */
const ShapeSelector = ({
  currentShape = "square",
  onChange,
  availableShapes = ["square", "circle", "hexagon", "squircle"],
  size = "medium",
}) => {
  // Map size variants to button classes
  const sizeClasses = {
    small: "p-1 w-6 h-6",
    medium: "p-2 w-8 h-8",
    large: "p-2 w-10 h-10",
  };

  const buttonSize = sizeClasses[size] || sizeClasses.medium;

  return (
    <div className="flex space-x-1">
      {availableShapes.map((shape) => {
        const Icon = SHAPES[shape]?.icon;
        if (!Icon) return null;

        return (
          <button
            key={shape}
            onClick={() => onChange(shape)}
            className={`${buttonSize} ${
              currentShape === shape
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            } rounded-md transition-colors duration-200`}
            title={SHAPES[shape]?.label || shape}
            aria-label={`Set shape to ${SHAPES[shape]?.label || shape}`}
          >
            <Icon size={size === "small" ? 14 : size === "large" ? 20 : 16} />
          </button>
        );
      })}
    </div>
  );
};

export default ShapeSelector;
