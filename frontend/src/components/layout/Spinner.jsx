import React from "react";

export default function Spinner({ size = 40, className = "" }) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      data-testid="spinner"
    >
      <svg
        className="animate-spin text-blue-600"
        width={size}
        height={size}
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-20"
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="5"
        />
        <path
          className="opacity-70"
          d="M45 25c0-11.046-8.954-20-20-20"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
