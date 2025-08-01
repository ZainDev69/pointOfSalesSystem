import React from "react";
import { cn } from "../../utils/cn";

const Button = React.forwardRef(
  (
    {
      children,
      variant = "default",
      size = "default",
      className,
      disabled = false,
      loading = false,
      icon: Icon,
      iconPosition = "left",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      default: "bg-sky-500 hover:bg-sky-600 text-white cursor-pointer",
      secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900",
      outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-900",
      ghost: "hover:bg-gray-100 text-gray-900",
      destructive: "bg-red-600 hover:bg-red-700 text-white",
      success: "bg-green-600 hover:bg-green-700 text-white",
      warning: "bg-yellow-600 hover:bg-yellow-700 text-white",
      info: "bg-blue-600 hover:bg-blue-700 text-white",
      sky: "bg-sky-500 hover:bg-sky-600 text-white",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm",
      default: "h-10 px-4 py-2",
      lg: "h-12 px-6 text-lg",
    };

    const classes = cn(baseClasses, variants[variant], sizes[size], className);

    return (
      <button
        className={classes}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {!loading && Icon && iconPosition === "left" && (
          <Icon className="w-4 h-4 mr-2" />
        )}
        {children}
        {!loading && Icon && iconPosition === "right" && (
          <Icon className="w-4 h-4 ml-2" />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
